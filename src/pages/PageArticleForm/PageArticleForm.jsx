import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import dcopy from 'deep-copy';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import * as ArticleFormActions from '../../actions/ArticleFormActions';
import * as ArticleActions from '../../actions/ArticleActions';
import * as C from '../../constants/app';

import Select from '../../components/Select/Select';
import Popup from '../../components/Popup/Popup';
import SelectAutocompleteAsync from '../../components/Select/SelectAutocompleteAsync';
import { Input } from '../../components/Input/InputComponents';
import { lang } from '../../assets/js/lang';
import Button from '../../components/Button/Button';
import FileUploader from '../../components/FileUploader/FileUploader';
import CheckUserAccess from '../../components/CheckUserAccess/CheckUserAccess';
import Page404 from '../Page404/Page404';
import Author from './Author';

import './article-form.css';

class PageArticleForm extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      getDiseasesByIds: PropTypes.func,
      getTreatmentsByIds: PropTypes.func,
      getCurrentArticle: PropTypes.func,
      clearArticleData: PropTypes.func,
      registerNewArticle: PropTypes.func,
      updateFields: PropTypes.func,
      cancelCreateArticle: PropTypes.func,
      updateAttachments: PropTypes.func,
      registerEditArticle: PropTypes.func,
      cancelEditArticle: PropTypes.func,
    }),
    attachments: PropTypes.arrayOf(
      PropTypes.shape({}),
    ),
    fields: PropTypes.shape({}),
    createArticleLoading: PropTypes.bool,
    createArticleSuccess: PropTypes.bool,
    createArticleError: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({}),
    ]),
    isUserInit: PropTypes.bool,
    user: PropTypes.shape({}),
    history: PropTypes.shape({}),
    location: PropTypes.shape({}),
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
        type: PropTypes.string,
      }),
    }),
    articleEditLoading: PropTypes.bool,
    articleEdit: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({}),
    ]),
    articleEditError: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({}),
      PropTypes.number,
    ]),
    articleEditSubmitLoading: PropTypes.bool,
    articleEditSubmit: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({}),
    ]),
    articleEditSubmitError: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({}),
    ]),
  }

  static defaultProps = {
    actions: {
      getDiseasesByIds: () => {},
      getTreatmentsByIds: () => {},
      getCurrentArticle: () => {},
      clearArticleData: () => {},
      articlesCancel: () => {},
      registerNewArticle: PropTypes.func,
      updateFields: () => {},
      cancelCreateArticle: () => {},
      updateAttachments: () => {},
      registerEditArticle: () => {},
      cancelEditArticle: () => {},
    },
    filter: {
      fields: {},
    },
    fields: {},
    attachments: [],
    createArticleLoading: false,
    createArticleSuccess: false,
    createArticleError: false,
    isUserInit: false,
    user: {},
    history: {},
    location: {},
    match: {
      params: {
        id: '',
        type: '',
      },
    },
    articleEditLoading: false,
    articleEdit: false,
    articleEditError: false,
    articleEditSubmitLoading: false,
    articleEditSubmit: false,
    articleEditSubmitError: false,
  }

  state = {
    authors: [],
    errors: {},
  }

  componentDidMount() {
    if (this.props.isUserInit) {
      CheckUserAccess(this.props.user, this.props.history, this.props.location);
    }

    this.checkEditArticle(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isUserInit) {
      CheckUserAccess(nextProps.user, nextProps.history, nextProps.location);
    }

    this.checkEditArticle(nextProps);

    // если прилетела ошибка
    if (!this.props.createArticleError && nextProps.createArticleError) {
      this.setState({
        errors: nextProps.createArticleError,
      });
    }

    // если прилетела ошибка от редактирования заявки
    if (!this.props.articleEditSubmitError && nextProps.articleEditSubmitError) {
      this.setState({
        errors: nextProps.articleEditSubmitError,
      });
    }

    if (this.props.articleEditSubmitError && !nextProps.articleEditSubmitError) {
      this.setState({
        errors: {},
      });
    }

    // если прилетели данные о текущей заявке для редактирования
    if (nextProps.articleEdit && !this.props.articleEdit) {
      this.parseArticleEdit(nextProps.articleEdit);
    }
  }

  // проверяем, не редактирование ли это и делаем соответствующие запросы
  checkEditArticle = (props) => {
    const {
      match: {
        params: {
          type,
          id,
        },
      },
    } = props;

    // если это редактирование и id integer
    // и если мы еще не запрашивали данные о заявке
    if (type && type === 'edit'
      && id
      && !props.articleEditLoading
      && !props.articleEdit
      && !props.articleEditError
      && !props.articleError) {
      props.actions.getArticleForEdit(id);
    }
  }

  cancelCreateArticle() {
    this.setState({
      authors: [],
      errors: {},
    });

    this.props.actions.cancelCreateArticle();
  }

  cancelEditArticle() {
    this.props.actions.cancelEditArticle();
  }

  parseArticleEdit(data) {
    const newFields = {
      diseases: data.diseases,
      patient_age: {
        id: data.patient_age.key,
        name: data.patient_age.display_value,
      },
      patient_gender: {
        id: data.patient_gender.key,
        name: data.patient_gender.display_value,
      },
      section: {
        id: data.section.key,
        name: data.section.display_value,
      },
      title: data.title,
      treatments: data.treatments,
    };

    const authors = data.authorships.map(item => item.user);

    if (data.attachments && data.attachments.length) {
      const attachmentsArr = data.attachments.map(item => (
        {
          id: item.id,
          isLoad: true,
          name: item.filename,
          src: item.file,
        }
      ));

      this.handleOnUpdateAttachments(attachmentsArr);
    }

    this.setState({
      authors: authors,
    });

    this.props.actions.updateFields(newFields);
  }

  @autobind
  handleOnChangeSelect(newValue, name) {
    let flag = false;
    const newFields = { ...this.props.fields };

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
      newFields[name] = newValue;
    } else {
      delete newFields[name];
    }

    this.props.actions.updateFields(newFields);
  }

  @autobind
  handleOnChangeInput(e) {
    const value = e.target.value;
    const newFields = dcopy(this.props.fields);

    if (value !== '') {
      newFields[e.target.id] = value;
    } else {
      delete newFields[e.target.id];
    }

    this.props.actions.updateFields(newFields);
  }

  @autobind
  handleOnUpdateAttachments(files) {
    this.props.actions.updateAttachments(files);
  }

  @autobind
  handleOnClickSubmit() {
    let newFormData = {};

    // если есть аттачменты
    if (this.props.attachments && this.props.attachments.length) {
      newFormData.attachments = [];
      Object.keys(this.props.attachments).forEach((element) => {
        newFormData.attachments.push(this.props.attachments[element].id);
      });
    }

    // если есть авторы
    if (this.state.authors.length) {
      newFormData.authors = [];

      for (let i = 0; i < this.state.authors.length; i++) {
        if (this.state.authors[i].id) {
          newFormData.authors.push({ id: this.state.authors[i].id });
        } else if (!this.state.authors[i].autocompleteMode) {
          newFormData.authors.push(this.state.authors[i]);
        }
      }
    }

    const a = dcopy(this.props.fields);
    newFormData = { ...newFormData, ...a };

    if (newFormData.section && this.props.fields.section) {
      newFormData.section = this.props.fields.section.id;
    }

    if (newFormData.patient_age && this.props.fields.patient_age) {
      newFormData.patient_age = this.props.fields.patient_age.id;
    }

    if (newFormData.patient_gender && this.props.fields.patient_gender) {
      newFormData.patient_gender = this.props.fields.patient_gender.id;
    }

    if (newFormData.diseases) {
      for (let i = 0; i < newFormData.diseases.length; i++) {
        if (newFormData.diseases[i].id) {
          newFormData.diseases[i] = { id: newFormData.diseases[i].id };
        }
      }
    }

    if (newFormData.treatments) {
      for (let i = 0; i < newFormData.treatments.length; i++) {
        if (newFormData.treatments[i].id) {
          newFormData.treatments[i] = { id: newFormData.treatments[i].id };
        }
      }
    }

    // если это создание заявки
    if (this.props.match.path.indexOf('/article/create') > -1) {
      this.props.actions.registerNewArticle(newFormData);
    }

    if (this.props.match.params.type === 'edit' && this.props.match.params.id) {
      this.props.actions.registerEditArticle(newFormData, this.props.match.params.id);
    }
  }

  // добавляем новую форму с пустым автором
  @autobind
  handleAddAuthor() {
    const newAuthors = dcopy(this.state.authors);
    newAuthors.push({
      autocompleteMode: true,
    });

    this.setState({
      authors: newAuthors,
    });
  }

  // удаляем пользователя
  @autobind
  handleRemoveAuthor(id) {
    const newAuthors = dcopy(this.state.authors);
    newAuthors.splice(id, 1);

    let newErrors = {};
    if (this.state.errors.authors) {
      newErrors = dcopy(this.state.errors);
      newErrors.authors.splice(id, 1);
    }

    this.setState({
      authors: newAuthors,
      errors: newErrors,
    });
  }

  // обновляем данные автора после ввода
  // чего-либо в компоненте <Author>
  @autobind
  handleUpdateAuthor(id, data) {
    const newAuthors = dcopy(this.state.authors);
    newAuthors[id] = data;

    this.setState({
      authors: newAuthors,
    });
  }

  @autobind
  handleOnClosePopup() {
    this.cancelCreateArticle();
  }

  @autobind
  handleOnCloseEditPopup() {
    this.cancelEditArticle();
  }

  render() {
    if (this.props.articleEditError && this.props.articleEditError === 404) {
      return <Page404 />;
    }

    const {
      fields,
      attachments,
    } = this.props;

    const authors = this.state.authors;
    let inputKey = 'title_input';

    if (this.props.createArticleSuccess) {
      inputKey = 'title_input_success';
    }

    if (this.props.articleEdit && fields.title) {
      inputKey = 'title_input_edit';
    }

    let submitButton = (<div className="article-form__submit">
      <Button text="Отправить в редакцию" onClick={this.handleOnClickSubmit} />
    </div>);

    if (this.props.match.params.type === 'edit' && this.props.match.params.id) {

      if (!this.props.articleEdit && !this.props.articleEditError) {
        return null;
      }

      submitButton = (<div className="article-form__submit">
        <Button text="Сохранить заявку" onClick={this.handleOnClickSubmit} />
      </div>);
    }

    return (
      <section className="section">
        {
          this.props.createArticleSuccess &&
          <Popup
            icon="reg"
            title={lang('articles', 'createSuccessTitle')}
            description={lang('articles', 'createSuccessDescription')}
            closeCallback={this.handleOnClosePopup}
            className="popup_center popup_type_reset"
          />
        }
        {
          this.props.articleEditSubmit &&
          <Popup
            icon="reg"
            title={lang('articles', 'editSuccessTitle')}
            description={lang('articles', 'editSuccessDescription')}
            closeCallback={this.handleOnCloseEditPopup}
            className="popup_center popup_type_reset"
          />
        }
        <div className="container">
          <h1 className="article-form__page-title">Расскажите о вашей клинической практике</h1>
          <div className="article-form__fields">
            <div className="row">
              <div className="col_24">
                <Input
                  label="Название статьи"
                  id="title"
                  value={fields.title || ''}
                  onChange={this.handleOnChangeInput}
                  key={inputKey}
                  error={this.state.errors.title}
                />
              </div>
            </div>
            <div className="row">
              <div className=" col_6 col_10-tablet col_24-mobile">
                <Select
                  onChange={this.handleOnChangeSelect}
                  name="section"
                  label="Рубрика статьи"
                  placeholder="Не важно"
                  value={fields.section || null}
                  valueKey="id"
                  error={this.state.errors.section}
                  labelKey="name"
                  options={[
                    { id: 'p', name: 'Практика' },
                    { id: 't', name: 'Теория' },
                  ]}
                />
              </div>
              <div className=" col_10 col_14-tablet col_24-mobile">
                <div className="Fileds__row row">
                  <div className=" col_12">
                    <Select
                      onChange={this.handleOnChangeSelect}
                      name="patient_gender"
                      label="Пол пациента"
                      value={fields.patient_gender || null}
                      valueKey="id"
                      labelKey="name"
                      error={this.state.errors.patient_gender}
                      options={[
                        { id: 'm', name: 'Муж.' },
                        { id: 'f', name: 'Жен.' },
                      ]}
                    />
                  </div>
                  <div className=" col_12">
                    <Select
                      onChange={this.handleOnChangeSelect}
                      name="patient_age"
                      valueKey="id"
                      labelKey="name"
                      label="Возраст пациента"
                      value={fields.patient_age || null}
                      error={this.state.errors.patient_age}
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
                  error={this.state.errors.diseases}
                  url="/articles/diseases/"
                  name="diseases"
                  label="Заболевание"
                  creatable
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
                  error={this.state.errors.treatments}
                  name="treatments"
                  label="Процедуры лечения"
                  creatable
                  multi
                  promptTextCreator={label => label}
                />
              </div>
            </div>
          </div>

          <div className="article-form__authors">
            <h4 className="article-form__authors-title">Информация об авторах</h4>
            <div className="article-form__authors-items">
              {
                authors.map((data, ind) => (
                  <Author
                    author={data}
                    updateAuthors={this.handleUpdateAuthor}
                    removeAuthor={this.handleRemoveAuthor}
                    id={ind}
                    errors={this.state.errors.authors && this.state.errors.authors[ind]}
                    key={`author-item_${ind}`}
                  />),
                )
              }
            </div>
            <Button className="article-form__authors-button button_nobg button_icon button_icon-add" text="Добавить соавтора" onClick={this.handleAddAuthor} />
          </div>

          <div className="article-form__attachments">
            <h4 className="article-form__authors-title">Материалы для статьи</h4>
            <p>Загрузите текстовые файлы и изображения, и наши редакторы создадут из них статью.</p>
            <FileUploader
              url={C.URL_API_SEND_FILES}
              files={attachments}
              onUpdateFiles={this.handleOnUpdateAttachments}
              labelSecond="Форматы: doc, docx, xls, txt, pdf, bmp, jpg, png, gif,  mpeg, avi, zip"
              ref="attachments"
              extensions={['doc', 'docx', 'xls', 'txt', 'pdf', 'bmp', 'jpg', 'png', 'gif', 'mpeg', 'avi']}
            />
          </div>
          { submitButton }
          { (this.props.articleEditSubmitError || this.props.createArticleError) && <div className="input__error">Проверьте правильность заполнения всех полей.</div> }

        </div>
      </section>

    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.app.user,
    auth: state.app.auth,
    isUserInit: state.app.isUserInit,
    fields: state.articleForm.fields,
    attachments: state.articleForm.attachments,
    articleLoading: state.articles.articleLoading,
    article: state.articles.article,
    articleError: state.articles.articleError,
    articleErrorStatus: state.articles.articleErrorStatus,
    createArticleSuccess: state.articleForm.createArticleSuccess,
    createArticleError: state.articleForm.createArticleError,
    createArticleLoading: state.articleForm.createArticleLoading,
    articleEditLoading: state.articleForm.articleEditLoading,
    articleEdit: state.articleForm.articleEdit,
    articleEditError: state.articleForm.articleEditError,
    articleEditSubmitLoading: state.articleForm.articleEditSubmitLoading,
    articleEditSubmit: state.articleForm.articleEditSubmit,
    articleEditSubmitError: state.articleForm.articleEditSubmitError,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...ArticleFormActions, ...ArticleActions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageArticleForm);
