import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import dcopy from 'deep-copy';
import moment from 'moment';
import { getInitialsName, convertPascalCase } from '../../assets/js/helpers';
import { lang } from '../../assets/js/lang';

import * as C from '../../constants/app';
import MetaPage from '../MetaPage/MetaPage';
import Material from '../../components/Material/Material';
import SearchTag from '../SearchTag/SearchTag';
import Authors from '../Authors/Authors';
import NavBack from '../../components/NavBack/NavBack';
import Comments from '../Comments/Comments';
import LockContent from '../LockContent/LockContent';
import BannerAction from '../BannerAction/BannerAction';
import ArticleBlocks from './ArticleBlocks';

import './article.css';

const ArticleList = props => (
  <div className="article-list">
    {
      props.items.map(item => (
        <NavLink to={item.to} className="article-list__item" key={`article-list__item_${item.id}`}>
          <img src={item.src} alt="" className="articel-list__item-img" />
          <div className="article-list__item-text">{item.text}</div>
        </NavLink>
      ))
    }
  </div>
);

ArticleList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape),
};

ArticleList.defaultProps = {
  items: [{}],
};

class Article extends Component {
  // выводим информацию о пациенте
  getPatientJSX() {
    const {
      material: {
        patient_gender: {
          display_value: gender = false,
          key: genderId,
        },
        patient_age: {
          display_value: age = false,
          key: ageId,
        },
        diseases = [],
      },
    } = this.props;

    let genderJSX = null;
    let ageJSX = null;
    let diseasesJSX = null;

    if (gender) {
      genderJSX = <NavLink to={`/articles?gender=${genderId}`} className="article__link-tag">{`${gender.toLowerCase()}`}</NavLink>;
    }
    if (age) {
      ageJSX = (<span>
        <span>{lang('patient', 'age')}</span>
        <NavLink to={`/articles?age=${ageId}`} className="article__link-tag">{age}</NavLink>
        <span>{lang('patient', 'age_value')}</span>
      </span>);
    }
    if (diseases.length) {
      diseasesJSX = (<span>
        <span>{lang('patient', 'disease')}</span>
        {diseases.map((desease, ind) => (
          <span key={desease.id}>
            <NavLink to={`/articles?diseases[0]=${desease.id}`} className="article__link-tag">{desease.name.toLowerCase()}</NavLink>
            {ind !== (diseases.length - 1) && ', '}
          </span>
        ))}
      </span>);
    }

    if (!age && !gender && !diseases.length) {
      return null;
    }

    return (
      <p>
        {lang('patient', 'patient')}
        {genderJSX}
        {ageJSX}
        {diseasesJSX}
      </p>
    );
  }

  // информация об авторах статьи
  getAuthorsJSX() {
    const {
      material: {
        authorships = [],
        user = {},
      },
    } = this.props;

    const authors = [];

    if (user.id) {
      authors.push(user);
    };

    if (authorships[0]) {
      authors.push(authorships[0]);

      if (authorships[1]) {
        authors.push(authorships[1]);
      }
    }

    if (!authors.length) {
      return null;
    }

    return (
      <div className="article__head-authors">
        {
          authors.map((author) => {
            const avatar = author.avatar ? `${C.URL_API}${author.avatar}` : false;
            return (this.props.isUserVerified ? (
              <NavLink className="article__head-author" key={author.id} to={`/profile/user/${author.id}`}>
                <div className="article__head-author-img-wrap" style={avatar ? { backgroundImage: `url(${avatar})`, backgroundColor: 'transparent' } : {}}>
                  {!avatar && getInitialsName(author.first_name) }
                </div>
                <div className="article__head-author-name">{`${author.last_name} ${author.first_name}`}</div>
              </NavLink>
            ) : (
              <span className="article__head-author" key={author.id}>
                <div className="article__head-author-img-wrap" style={avatar ? { backgroundImage: `url(${avatar})`, backgroundColor: 'transparent' } : {}}>
                  {!avatar && getInitialsName(author.first_name) }
                </div>
                <div className="article__head-author-name">{`${author.last_name} ${author.first_name}`}</div>
              </span>
            ));
          })
        }
      </div>
    );
  }

  // список тем в статье
  getTreatmnetsJSX() {
    const {
      material: {
        treatments = [],
      },
    } = this.props;

    if (!treatments.length) {
      return null;
    }

    return (
      <p>
        <span>{'Были проведены '}</span>
        {treatments.map((treatment, ind) => (
          <span key={treatment.id}>
            <NavLink to={`/articles?treatments[0]=${treatment.id}`} className="article__link-tag">{treatment.name.toLowerCase()}</NavLink>
            {ind !== (treatments.length - 1) && ', '}
          </span>
        ))}
      </p>
    );
  }

  // список материалов
  getMaterialsJSX() {
    const {
      material: {
        content = [],
      },
      quizOnChange = () => {},
    } = this.props;

    if (!content.length) {
      return null;
    }

    return (
      <div>{content.map((block) => {
        const componentName = convertPascalCase(block.type);
        const ArticleComponent = ArticleBlocks[componentName];
        if (!ArticleComponent) return null;

        let elRow = null;

        if (componentName === 'TwoColumn') {
          let quizResult = false;
          // если прошли тест
          if (block.value.stats && block.value.stats.is_passed) {
            quizResult = block.value.stats.answers;
          }

          elRow = (
            <ArticleComponent
              value={block.value}
              id={block.id}
              key={block.id}
              quizOnChange={quizOnChange}
              articleQuizes={quizResult}
            />);
        } else if (componentName === 'Image' || componentName === 'Video') {
          elRow = (
            <div className="article__row" key={block.id}>
              <ArticleComponent value={block.value} id={block.id} />
            </div>
          );
        } else if (componentName === 'Quiz') {
          let quizResult = false;
          // если прошли тест
          if (block.value.stats && block.value.stats.is_passed) {
            quizResult = block.value.stats.answers;
          }

          elRow = (
            <div className="article__row" key={block.id}>
              <div className="article__text-wrap">
                <ArticleComponent
                  value={block.value}
                  id={block.id}
                  onSubmit={quizOnChange}
                  articleQuizes={quizResult}
                />
              </div>
            </div>
          );
        } else {
          elRow = (
            <div className="article__row" key={block.id}>
              <div className="article__text-wrap">
                <ArticleComponent value={block.value} id={block.id} />
              </div>
            </div>
          );
        }

        return elRow;
      })}
      </div>);
  }

  // баннер в конце статьи
  getBannerJSX = () => (
    this.props.isUserVerified
      ? (<div className="article__text-wrap">
        <div className="article__banner-action">
          <BannerAction
            title="Поделитесь вашим опытом "
            desc="Отправьте нам текст и материалы о вашем исследовании или практическом опыте, и очень скоро статья с указанием вашего авторства появится на сайте."
            buttonText="Отправить материал"
            img={require('../../static/banner-action-1.jpg')}
            buttonTo="/article/create"
            className=""
          />
        </div>
      </div>)
      : null
  );

  // теги статьи
  getTagsJSX() {
    if (!this.props.isUserVerified) {
      return null;
    }

    const {
      material: {
        tags = [],
      },
    } = this.props;

    if (!tags.length) {
      return null;
    }

    return (<div className="article__side-wrap-tags">
      <div className="article__tags">
        {
          tags.map(item => (<SearchTag text={item.name} to={`/articles/?tag=${item.id}`} key={item.id} />))
        }
      </div>
    </div>);
  }

  // большой блок со всеми авторами в статье
  getAuthorsFullJSX() {
    const {
      material: {
        authorships = [],
        user = {},
      },
    } = this.props;

    const authors = dcopy(authorships);

    if (user.id) {
      authors.unshift(user);
    }

    if (!authors.length) {
      return null;
    }

    return (
      <section className="section section_authors">
        <div className="container">
          <Authors
            className="authors_bg-dark"
            titleVariants={lang('articles', 'authors')}
            items={authors}
            isUserVerified={this.props.isUserVerified}
          />
        </div>
      </section>
    );
  }

  render() {
    const material = this.props.material;
    const materialDate = material.first_published_at ? moment(material.first_published_at).format('DD MMMM YYYY') : null;

    const comps = {
      author: this.getAuthorsJSX(),
      treatments: this.getTreatmnetsJSX(),
      patient: null,
      materials: (
        <LockContent userVerifiedType={this.props.userVerifiedType} text="После регистрации и&nbsp;прохождения теста вы&nbsp;сможете прочесть статью, оставить отзыв или комментарий и&nbsp;добавить статью в&nbsp;&laquo;Избранное&raquo;." />
      ),
      banner: null,
      tags: null,
      authorsFull: null,
    };

    if (this.props.isUserVerified) {
      comps.patient = this.getPatientJSX();
      comps.materials = this.getMaterialsJSX();
      comps.banner = this.getBannerJSX();
      comps.tags = this.getTagsJSX();
      comps.authorsFull = this.getAuthorsFullJSX();
    }

    // выводим инфо пациента
    return (
      <Material
        subject={material}
        noAlarmComponent={false}
        favoritesPatchAction={this.props.favoritesPatchAction}
      >
        <div className="article">
          <section className="section">
            <div className="container">
              <NavBack title="Материалы" onClick={() => { this.props.history.goBack()} } />
              <MetaPage left={material.section.display_value} right={materialDate} />
              <h1 className="article__title">{material.title}</h1>
              {material.lead && <div className="article__title-lead">{material.lead}</div>}
              {(material.thumbnail && this.props.isUserVerified) && <img className="article__img-head" src={`${C.URL_API}${material.thumbnail.url}`} alt={material.thumbnail.alt} />}

              {
                // если есть хоть что-то из информации в шапке
                (comps.author || comps.patient || comps.treatments) &&
                <div className="article__head-rows">
                  <div className="article__head-row">
                    {comps.author}
                  </div>

                  {(comps.patient || comps.treatments) &&
                    <div className="article__head-row article__head-row_tags">
                      {comps.patient}
                      {comps.treatments}
                    </div>
                  }
                </div>
              }

              {comps.materials}

              {
                // <LockContent text="После регистрации вы сможете прочесть
                //   статью полностью, оставить  отзыв или комментарий и добавить
                //   статью в «Избранное». " />
              }
              {/* <div className="article__row">
                <div className="article__row">
                  <div className="article__attachment">
                    <div className="article__attachment-content">
                      <Carousel >
                        <div>
                          <img alt="" src={import('../../static/carousel-img-1.jpg')} />
                        </div>
                        <div>
                          <img alt="" src={import('../../static/carousel-img-2.jpg')} />
                        </div>
                        <div>
                          <img alt="" src={import('../../static/carousel-img-3.jpg')} />
                        </div>
                      </Carousel>
                    </div>

                    <div className="article__attachment-desc">Новые технологии для диагностики забоеваний сердечно-сосудистой системы</div>
                  </div>
                </div>
              </div> */}

              <div className="article__row">
                {comps.banner}
                {comps.tags}
              </div>

            </div>
          </section>

          {comps.authorsFull}
          {(this.props.isUserVerified) ?
            <section className="section">
              <div className="container">
                <Comments
                  items={this.props.comments.result}
                  total={this.props.comments.total}
                  isEditComment={this.props.isEditComment}
                  idEditComment={this.props.idEditComment}
                  createComment={this.props.createComment}
                  resetEditComment={this.props.resetEditComment}
                  unMountCreateComment={this.props.unMountCreateComment}
                  setEditComment={this.props.setEditComment}
                  patchCommentVotes={this.props.patchCommentVotes}
                  user={this.props.user}
                />
              </div>
            </section> : null }
        </div>
      </Material>
    );
  }
}

export default Article;

Article.propTypes = {
  createComment: PropTypes.func,
  patchCommentVotes: PropTypes.func,
  setEditComment: PropTypes.func,
  resetEditComment: PropTypes.func,
  favoritesPatchAction: PropTypes.func,
  unMountCreateComment: PropTypes.func,
  idEditComment: PropTypes.number,
  isEditComment: PropTypes.bool,
  isUserInit: PropTypes.bool,
  comments: PropTypes.shape({
    total: PropTypes.number,
    next: PropTypes.string,
    result: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
      }),
    ),
  }),
  user: PropTypes.shape({
    id: PropTypes.number,
  }),
  // Неизвестно, что там будет приходить в объекте. По готовности спросить Женю
  quizOnChange: PropTypes.func,
  isUserVerified: PropTypes.bool,
  material: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    // authorships [{id: 1, name: '', photo: '', role: ''}, ...]
    authorships: PropTypes.arrayOf(PropTypes.object),
    category: PropTypes.objectOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ])), // {id: 1, name: ''}
    diseases: PropTypes.arrayOf(PropTypes.object), // [{id: 1, name: 'Флебология'}, ...]
    first_published_at: PropTypes.string,
    last_published_at: PropTypes.string,
    lead: PropTypes.string,
    patient_age: PropTypes.shape({
      display_value: PropTypes.string,
      key: PropTypes.string,
    }),
    patient_gender: PropTypes.shape({
      display_value: PropTypes.string,
      key: PropTypes.string,
    }),
    section: PropTypes.shape({
      display_value: PropTypes.string,
      key: PropTypes.string,
    }),
    tags: PropTypes.arrayOf(
      PropTypes.object,
    ),
    teaser: PropTypes.string,
    thumbnail: PropTypes.objectOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ])), // {alt: '', url: '', width: 500, height: 500}
    treatments: PropTypes.arrayOf(PropTypes.object), // [{id: 1, name: 'Флебология'}, ...]
    user: PropTypes.shape({
      academic_degree: PropTypes.string,
      academic_rank: PropTypes.string,
      avatar: PropTypes.string,
      first_name: PropTypes.string,
      id: PropTypes.number,
      last_name: PropTypes.string,
      middle_name: PropTypes.string,
    }),
    content: PropTypes.arrayOf(PropTypes.object),
  }),
};

Article.defaultProps = {
  user: {},
  createComment: () => {},
  favoritesPatchAction: () => {},
  resetEditComment: () => {},
  setEditComment: () => {},
  patchCommentVotes: () => {},
  unMountCreateComment: () => {},
  idEditComment: -100,
  isEditComment: false,
  isUserInit: false,
  comments: {
    total: 0,
    next: '',
    result: [
      {
        id: 0,
      },
    ],
  },
  quizOnChange: () => {},
  isUserVerified: false,
  material: {
    id: '',
    title: '',
    authorships: [], // [{id: 1, name: '', photo: '', role: ''}, ...]
    category: {}, // {id: 1, name: ''}
    diseases: [], // [{id: 1, name: 'Флебология'}, ...]
    first_published_at: '',
    last_published_at: '',
    lead: '',
    patient_age: {
      display_value: '',
      key: '',
    },
    patient_gender: {
      display_value: '',
      key: '',
    },
    section: {
      display_value: '',
      key: '',
    },
    tags: [], // ['tag1', 'tag2', ...]
    teaser: '',
    thumbnail: {
      alt: '',
      url: '',
    },
    treatments: [],
    user: {},
    content: [],

  },
};
