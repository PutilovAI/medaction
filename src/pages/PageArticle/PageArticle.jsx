import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import dcopy from 'deep-copy';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import * as queryString from 'query-string';

import { endingWords } from '../../assets/js/helpers';
import { lang } from '../../assets/js/lang';

import * as CommentsActions from '../../actions/CommentsAction';
import * as ArticleActions from '../../actions/ArticleActions';
import * as ActivityAction from '../../actions/ActivityAction';

import LockContent from '../../components/LockContent/LockContent';
import Filtering from '../../components/Filtering/Filtering';
import ArticleTiles from '../../components/ArticleTiles/ArticleTiles';
import SearchResultMessage from '../../components/SearchResultMessage/SearchResultMessage';
import BannerAction from '../../components/BannerAction/BannerAction';
import Pagination from '../../components/Pagination/Pagination';
import Article from '../../components/Article/Article';
import ArticlePopular from '../../components/ArticlePopular/ArticlePopular';
import * as AppActions from '../../actions/AppActions';
import Page404 from '../Page404/Page404';
import Select from '../../components/Select/Select';
import SelectAutocompleteAsync from '../../components/Select/SelectAutocompleteAsync';

import '../../assets/style/blocks/text.css';

class PageArticle extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      getArticles: PropTypes.func,
      updateFilter: PropTypes.func,
      getDiseasesByIds: PropTypes.func,
      getTreatmentsByIds: PropTypes.func,
      getCurrentArticle: PropTypes.func,
      clearArticleData: PropTypes.func,
      getArticlePopular: PropTypes.func,
      articlesCancel: PropTypes.func,
      articleQuizSendForm: PropTypes.func,
      getComments: PropTypes.func,
      commentsAdd: PropTypes.func,
      patchVotes: PropTypes.func,
    }),
    comments: PropTypes.shape({
      total: PropTypes.number,
      next: PropTypes.string,
      result: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
        }),
      ),
    }),
    filter: PropTypes.shape({
      fields: PropTypes.object,
    }),
    articlesList: PropTypes.oneOfType([
      PropTypes.shape({
        results: PropTypes.arrayOf(
          PropTypes.object,
        ),
      }),
      PropTypes.bool,
    ]),
    articlesloading: PropTypes.bool,
    location: PropTypes.shape({
      search: PropTypes.string,
      pathname: PropTypes.string,
    }),
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.oneOfType([
          PropTypes.bool,
          PropTypes.number,
          PropTypes.string,
        ]),
      }),
    }),
    history: PropTypes.shape({
      push: PropTypes.function,
    }),
    diseases: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.bool,
    ]),
    treatments: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.bool,
    ]),
    article: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({}),
    ]),
    articleError: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({}),
      PropTypes.string,
    ]),
    articlePopularLoading: PropTypes.bool,
    articlePopularList: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({}),
    ]),
    articlePopularError: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({}),
      PropTypes.string,
    ]),
    articleErrorStatus: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
    ]),
  }

  static defaultProps = {
    actions: {
      getArticles: () => {},
      updateFilter: () => {},
      getDiseasesByIds: () => {},
      getTreatmentsByIds: () => {},
      getCurrentArticle: () => {},
      clearArticleData: () => {},
      getArticlePopular: () => {},
      articlesCancel: () => {},
      articleQuizSendForm: () => {},
      getComments: () => {},
      commentsAdd: () => {},
      patchVotes: () => {},
    },
    comments: {
      total: 0,
      next: '',
      result: [
        {},
      ],
    },
    filter: {
      fields: {},
    },
    articlesList: false,
    articlesloading: false,
    articleErrorStatus: false,
    location: {
      search: '',
      pathname: '',
    },
    match: {
      params: {
        id: false,
      },
    },
    history: {},
    diseases: false,
    treatments: false,
    article: false,
    articleError: false,
    articlePopularLoading: false,
    articlePopularList: false,
    articlePopularError: false,
  }

  state = {
    isEditComment: false,
    idEditComment: -100,
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      this.getCurrentArticle(this.props);
      this.getArticleComments(this.props);
    } else {
      this.getArticles(this.props);
      this.getDiseases(this.props);
      this.getTreatments(this.props);
      this.getFiltersFromLocation(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id) {
      if ((!this.props.articlesloading && this.props.match.params.id !== nextProps.match.params.id)
        || (this.props.user.id !== nextProps.user.id)) {
        this.getCurrentArticle(nextProps);
        this.getArticleComments(nextProps);
      }

      // if (!this.props.articlePopularLoading &&
      //   this.props.match.params.id !== nextProps.match.params.id) {
      //   this.props.actions.getArticlePopular();
      // }

      if (!this.props.articlePopularLoading
        && this.props.article
        && !this.props.articlePopularList
        && !this.props.articlePopularError) {
        this.props.actions.getArticlePopular();
      }
    } else {
      if (this.props.article) {
        this.props.actions.clearArticleData();
      }
      if (!this.props.articlesloading &&
        (this.props.location.pathname !== nextProps.location.pathname ||
        this.props.location.search !== nextProps.location.search)) {
        this.getArticles(nextProps);
        this.getFiltersFromLocation(nextProps);
      }

      if ((!this.props.diseases && nextProps.diseases)
        || (!this.props.treatments && nextProps.treatments)) {
        this.getFiltersFromLocation(nextProps);
      }

      if (!this.props.diseases && nextProps.diseases) {
        this.getFiltersFromLocation(nextProps);
      }
    }
  }

  componentWillUnmount() {
    this.props.actions.articlesCancel();
  }

  getCurrentArticle(props) {
    this.props.actions.getCurrentArticle(props.match.params.id);
  }

  getArticleComments(props) {
    this.props.actions.getComments('article', props.match.params.id, true);
  }

  getDiseases(props) {
    const query = queryString.parse(props.location.search);
    const themesArr = [];

    Object.keys(query).forEach((element) => {
      if (element.indexOf('diseases') > -1) {
        themesArr.push(query[element]);
      }
    });

    // если мы зашли на страницу уже с темами в GET-параметрах
    if (themesArr.length) {
      this.props.actions.getDiseasesByIds(themesArr);
    }
  }

  getTreatments(props) {
    const query = queryString.parse(props.location.search);
    const treatmentsArr = [];

    Object.keys(query).forEach((element) => {
      if (element.indexOf('treatments') > -1) {
        treatmentsArr.push(query[element]);
      }
    });

    // если мы зашли на страницу уже с темами в GET-параметрах
    if (treatmentsArr.length) {
      this.props.actions.getTreatmentsByIds(treatmentsArr);
    }
  }

  getArticles(props) {
    this.props.actions.getArticles(queryString.parse(props.location.search));
  }

  // при заходе на страницу обновляем дефолтные значения в фильтрах,
  // если в адресной строке что-то есть
  getFiltersFromLocation(nextProps) {
    const query = queryString.parse(nextProps.location.search);
    const resultQuery = { fields: {} };

    if (nextProps && nextProps.diseases) {
      resultQuery.fields.diseases = nextProps.diseases;
    }

    if (nextProps && nextProps.treatments) {
      resultQuery.fields.treatments = nextProps.treatments;
    }

    if (query.age) {
      resultQuery.fields.age = query.age;
    }

    if (query.gender) {
      resultQuery.fields.gender = query.gender;
    }

    if (query.section) {
      resultQuery.fields.section = query.section;
    }

    if (query.search_query) {
      resultQuery.fields.search_query = query.search_query;
    }

    this.props.actions.updateFilter(resultQuery);
  }

  @autobind
  handleOnApplyFilter() {
    this.parseFilters(this.props.filter.fields);
  }

  @autobind
  handleOnChangeSelect(newValue, name) {
    let flag = false;
    const newFilter = dcopy(this.props.filter);
    const newFields = newFilter.fields || {};

    if (newValue !== null) {
      flag = true;

      if (Array.isArray(newValue)) {
        if (newValue.length) {
          newValue.forEach((item, index) => {
            // Данные которых нет в базе
            if (item.className === 'Select-create-option-placeholder') {
              newValue[index] = { name: item.name };
            }
          });
        } else {
          flag = false;
        }
      }
    }

    if (flag) {
      newFields[name] = newValue.id || newValue;
    } else {
      delete newFields[name];
    }

    newFilter.fields = newFields;

    this.props.actions.updateFilter(newFilter);
  }

  parseFilters = (data = {}) => {
    // const currentQuery = queryString.parse(this.props.location.search);
    const resultQuery = {};

    const filters = dcopy(data);

    if (filters.diseases && filters.diseases.length) {
      resultQuery.diseases = [];
      filters.diseases.forEach((elem, index) => {
        resultQuery[`diseases[${index}]`] = elem.id;
      });
      delete filters.diseases;
    }

    if (filters.treatments && filters.treatments.length) {
      resultQuery.treatments = [];
      filters.treatments.forEach((elem, index) => {
        resultQuery[`treatments[${index}]`] = elem.id;
      });

      delete filters.treatments;
    }

    const query = Object.assign({}, resultQuery, filters);
    this.props.history.push(`/articles?${decodeURIComponent(queryString.stringify(query))}`);
  }

  handleOnChangeQuiz = (data) => {
    if (data) {
      this.props.actions.articleQuizSendForm(data, this.props.match.params.id);
    }
  }

  @autobind
  renderFieldsFilter() {
    const { fields = {} } = this.props.filter;
    return (
      <div>
        <div className="row">
          <div className=" col_6 col_10-tablet col_24-mobile">
            <Select
              onChange={this.handleOnChangeSelect}
              name="section"
              label={lang('select', 'rubric')}
              placeholder={lang('select', 'not_important')}
              value={fields.section || null}
              valueKey="id"
              labelKey="name"
              options={[
                { id: 'p', name: lang('select', 'practice') },
                { id: 't', name: lang('select', 'theory') },
              ]}
            />
          </div>
          <div className=" col_10 col_14-tablet col_24-mobile">
            <div className="Fileds__row row">
              <div className=" col_12">
                <Select
                  onChange={this.handleOnChangeSelect}
                  name="gender"
                  label={lang('select', 'gender')}
                  value={fields.gender || null}
                  valueKey="id"
                  labelKey="name"
                  options={[
                    { id: 'm', name: lang('select', 'genderM') },
                    { id: 'f', name: lang('select', 'genderF') },
                  ]}
                />
              </div>
              <div className=" col_12">
                <Select
                  onChange={this.handleOnChangeSelect}
                  name="age"
                  valueKey="id"
                  labelKey="name"
                  label={lang('select', 'age')}
                  value={fields.age || null}
                  options={[
                    { id: '1', name: '0-6' },
                    { id: '2', name: '6-10' },
                    { id: '3', name: '10-16' },
                    { id: '4', name: '16-19' },
                    { id: '5', name: '19-24' },
                    { id: '6', name: '24-30' },
                    { id: '7', name: '30-40' },
                    { id: '8', name: '40-60' },
                    { id: '9', name: '60-100' },
                  ]}
                />
              </div>
            </div>
          </div>

        </div>
        <div className="row">
          <div className="col_12 col_24-mobile">
            <SelectAutocompleteAsync
              onChange={this.handleOnChangeSelect}
              value={fields.diseases || null}
              onBlurResetsInput={false}
              valueKey="id"
              labelKey="name"
              url="/articles/diseases/"
              name="diseases"
              label={lang('select', 'disease')}
              multi
              promptTextCreator={label => label}
            />
          </div>
          <div className="col_12 col_24-mobile">
            <SelectAutocompleteAsync
              onChange={this.handleOnChangeSelect}
              value={fields.treatments || null}
              onBlurResetsInput={false}
              valueKey="id"
              labelKey="name"
              url="/articles/treatments/"
              name="treatments"
              label={lang('select', 'treatment')}
              multi
              promptTextCreator={label => label}
            />
          </div>

        </div>
      </div>
    );
  }
  @autobind
  setEditComment(id) {
    this.setState({
      isEditComment: true,
      idEditComment: id,
    });
  }

  @autobind
  resetEditComment() {
    this.setState({
      isEditComment: false,
      idEditComment: -100,
    });
  }

  @autobind
  createComment(data, method, subjectId) {
    this.props.actions.commentsAdd(data, 'article', this.props.match.params.id, method, subjectId, () => {
      this.props.actions.getComments('article', this.props.match.params.id, true);
    });
  }

  @autobind
  favoritesPatchAction(action) {
    this.props.actions.favoritesPatch(action, 'article', this.props.match.params.id, () => {
      this.props.actions.getCurrentArticle(this.props.match.params.id);
    });
  }

  unMountCreateComment = () => {
    try {
      for (let i = 0; i < document.getElementsByClassName('comment-create_new-render').length; i += 1) {
        ReactDom.unmountComponentAtNode(
          document.getElementsByClassName('comment-create_new-render')[i].parentNode,
        );
      }
    } catch (e) {
      // error
    }
  }

  @autobind
  patchCommentVotes(data, id) {
    // засылаем
    // data - объект с рейтингом
    // subject - куда ставим лайк
    // id - id объекта
    // дальше идет то, что мы должны перезагрузить
    // parentSubject - то, где находятся комменты
    // parentId - id того, где находятся комменты
    // флаг на подгрузку всего содержимого true/false
    this.props.actions.patchVotes(data, 'comment', id, 'article', this.props.match.params.id, true);
  }

  render() {
    let renderComponent = null;
    let isUserVerified = false;
    let userVerifiedType = false;
    if (this.props.isUserInit
      && this.props.user
      && this.props.user.is_test_passed
      && this.props.user.is_email_confirmed) {
      isUserVerified = true;
    } else {

      if (!this.props.user || !this.props.user.id) {
        userVerifiedType = 'auth';
      } else if (!this.props.user.is_test_passed) {
        userVerifiedType = 'test';
      } else if (!this.props.user.is_email_confirmed) {
        userVerifiedType = 'email';
      }
    }

    // если конкретная статья
    if (this.props.match.params && this.props.match.params.id) {
      if (this.props.articleErrorStatus === 404) {
        renderComponent = <Page404 />;
      } else if (!this.props.article.id && !this.props.articleError) {
        renderComponent = null;
      } else {
        renderComponent = (<div className="article-page">
          <Article
            history={this.props.history}
            material={this.props.article}
            quizOnChange={this.handleOnChangeQuiz}
            isUserVerified={isUserVerified}
            userVerifiedType={userVerifiedType}
            comments={this.props.comments}
            isEditComment={this.state.isEditComment}
            idEditComment={this.state.idEditComment}
            createComment={this.createComment}
            unMountCreateComment={this.unMountCreateComment}
            resetEditComment={this.resetEditComment}
            setEditComment={this.setEditComment}
            patchCommentVotes={this.patchCommentVotes}
            favoritesPatchAction={this.favoritesPatchAction}
            user={this.props.user}
            isUserInit={this.props.isUserInit}
          />
          {
            this.props.articlePopularList
              ? <section className="section section_popular">
                <div className="container">
                  <h3 className="section__title section__title_popular">Популярные статьи</h3>
                  <ArticlePopular items={this.props.articlePopularList.results} />
                </div>
              </section> : null
          }
        </div>);
      }
    } else {
      let searchResultsText = '';

      const {
        filter,
        actions: {
          updateFilter,
        },
      } = this.props;

      let PaginationComp = null;
      if (this.props.articlesList && this.props.articlesList.count) {
        const countItems = this.props.articlesList.count;
        PaginationComp = (<Pagination
          search={this.props.location.search}
          total={Math.ceil(countItems / 9)}
          pageSize={9}
        />);
        searchResultsText = `${endingWords(lang('filters', 'searched'), countItems)} ${countItems} ${endingWords(lang('filters', 'materials'), countItems)}`;
      }

      const bannerImg = require('../../static/banner-action-2.jpg');
      let BannerActionJSX = null;
      if (isUserVerified) {
        BannerActionJSX = (<BannerAction
          title={lang('banner1', 'title')}
          desc={lang('banner1', 'description')}
          buttonText={lang('banner1', 'buttonText')}
          buttonTo="/article/create"
          img={bannerImg}
          className="banner-action_bg-dark"
        />);
      }
      renderComponent = (
        <div>
          <section className="section section_articles">
            <div className="container">
              <h1>{lang('material', 'materials')}</h1>

              <Filtering
                filter={filter}
                updateFilter={updateFilter}
                renderFields={this.renderFieldsFilter}
                applyFilter={this.handleOnApplyFilter}
              />

              {
                (!isUserVerified && this.props.isUserInit) ? (
                  <div>
                    <div className="text-search-result">{searchResultsText}</div>
                    <LockContent userVerifiedType={userVerifiedType} text="После регистрации и&nbsp;прохождения теста вы&nbsp;получите доступ ко всем статья, сможете оставлять отзывы или комментарии и&nbsp;добавлять статьи в&nbsp;&laquo;Избранное&raquo;." />
                    {this.props.articlesList.count === 0 ? <SearchResultMessage
                      success={false}
                      title="Пока этот раздел пустой, но вы уже можете прислать свои материалы"
                    /> : <ArticleTiles items={this.props.articlesList.results} /> }
                  </div>
                ) : (
                  <div>
                    <div className="text-search-result">{searchResultsText}</div>
                    {this.props.articlesList.count === 0 ? <SearchResultMessage
                      title="Пока этот раздел пустой, но вы уже можете прислать свои материалы"
                      success={false}
                    /> : <ArticleTiles items={this.props.articlesList.results} /> }

                    { PaginationComp }
                    { BannerActionJSX }
                  </div>
                )
              }

            </div>
          </section>
        </div>
      );
    }

    return renderComponent;
  }
}

function mapStateToProps(state) {
  return {
    user: state.app.user,
    comments: state.comments.comments,
    commentsLoading: state.comments.commentsLoading,
    commentsMessage: state.comments.commentsMessage,
    isUserInit: state.app.isUserInit,
    filter: state.articles.filter,
    articlesList: state.articles.list,
    diseases: state.articles.diseases,
    treatments: state.articles.treatments,
    diseasesError: state.articles.diseasesError,
    treatmentsError: state.articles.treatmentsError,
    articleLoading: state.articles.articleLoading,
    article: state.articles.article,
    articleError: state.articles.articleError,
    articleErrorStatus: state.articles.articleErrorStatus,
    articlePopularLoading: state.articles.articlePopularLoading,
    articlePopularList: state.articles.articlePopularList,
    articlePopularError: state.articles.articlePopularError,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...ArticleActions,
      ...AppActions,
      ...CommentsActions,
      ...ActivityAction }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageArticle);
