import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import dcopy from 'deep-copy';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import { lang } from '../../assets/js/lang';
import Popup from '../../components/Popup/Popup';
import * as RegisterActions from '../../actions/RegisterActions';
import * as AppActions from '../../actions/AppActions';
import Social from '../../components/Social/Social';
import { Input, InputDate, Checkbox, InputMask, InputPasswordSwitch } from '../../components/Input/InputComponents';
import Button from '../../components/Button/Button';
import { URL_API_SOCIAL_LOGIN } from '../../constants/app';

import './page-register.css';

class PageRegister extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      updateFields: PropTypes.func,
      registerSendForm: PropTypes.func,
      changePassword: PropTypes.func,
      editSendForm: PropTypes.func,
      cancelRegisterEdit: PropTypes.func,
      userGetProfile: PropTypes.func,
      unBindSocial: PropTypes.func,
    }),
    fields: PropTypes.shape({
      password_new: PropTypes.string,
      password_old: PropTypes.string,
    }),
    fieldsErrors: PropTypes.shape({}),
    formSendSuccess: PropTypes.bool,
    history: PropTypes.shape({
      push: PropTypes.function,
    }),
    changePasswordSuccess: PropTypes.bool,
    changePasswordError: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object,
    ]),
    user: PropTypes.shape({
      id: PropTypes.number,
      social_networks: PropTypes.arrayOf(
        PropTypes.string,
      ),
    }),
    editProfileSuccess: PropTypes.bool,
    match: PropTypes.shape({
      path: PropTypes.string,
    }),
    auth: PropTypes.bool,
  }

  static defaultProps = {
    actions: {
      updateFields: () => {},
      registerSendForm: () => {},
      changePassword: () => {},
      editSendForm: () => {},
      cancelRegisterEdit: () => {},
      unBindSocial: () => {},
      userGetProfile: () => {},
    },
    fields: {},
    fieldsErrors: {},
    formSendSuccess: false,
    history: {},
    changePasswordSuccess: false,
    changePasswordError: false,
    user: {
      social_networks: [],
    },
    editProfileSuccess: false,
    match: {},
    auth: false,
  }

  state = {
    isOpenPopupWithArgee: false,
  }

  componentDidMount() {
    if (this.props.auth && this.props.user.id) {
      if (this.props.match && this.props.match.path.indexOf('profile/edit') > -1) {
        this.setDefaultUserData(this.props);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    //  если это редактирование своего пользователя
    if (nextProps.match && nextProps.match.path.indexOf('profile/edit') > -1) {
      if (!this.props.auth && nextProps.auth) {
        if (nextProps.user.id) {
          this.setDefaultUserData(nextProps);
        }
      }
    }

    // если успешно обновили пользователя
    if (nextProps.editProfileSuccess) {
      // проверяем, что с отправкой смены пароля,
      // она async и может прийти раньше или позже editProfileSuccess
      if (nextProps.fields.password_new
        && nextProps.fields.password_old) {
        // если и пароль успешно отправлен, то все ок
        // и переходим на главную профиля
        if (nextProps.changePasswordSuccess) {
          this.props.actions.userGetProfile();
          this.props.history.push('/profile/');
        }
      } else {
        // если пароль не изменялся, то сразу переходим на главную профиля
        this.props.history.push('/profile/');
      }
    }
  }

  componentWillUnmount() {
    const newFields = dcopy(this.props.fields);
    newFields.password = '';
    this.props.actions.cancelRegisterEdit();
    //this.props.actions.updateFields(newFields);
  }

  getRegisterStatusJSX() {
    if (this.props.formSendSuccess) {
      return (
        <Popup
          icon="reg"
          title={lang('register', 'confirm')}
          description={lang('register', 'confirmDescription')}
          closeCallback={this.handleOnClosePopup}
          className="popup_center popup_type_reset"
        />
      );
    }

    return null;
  }

  getSubmitJSX(isEdit) {
    if (isEdit) {
      return (
        <div className="page-register__submit-wrap">
          <div className="page-register__submit">
            <Button text="Сохранить изменения" onClick={this.handleOnClickSave} />
          </div>
        </div>
      );
    }

    return (
      <div className="page-register__submit-wrap">
        <div className="page-register__submit-wrap-text">
          <Checkbox
            id="agree_check"
            defaultChecked={false}
            onChange={this.handleOnChangeCheckbox}
          >
            <span className="input__label-text">Проставляя отметку, я&nbsp;даю свое <span role="button" className="link" tabIndex={-1} onClick={this.agreement}>согласие</span> на&nbsp;обработку моих <a href='/static-pages/personal-information' target='_blank'>персональных данных</a> в&nbsp;соответствии с&nbsp;Федеральным законом от&nbsp;27.07.2006 года &#8470;&nbsp;152-ФЗ &laquo;О&nbsp;персональных данных&raquo; и&nbsp;получение информационных рассылок</span>
          </Checkbox>
          <div className="input__error input__checkbox-error" style={{ display: 'none' }} ref={(c) => { this.agree_check = c; }}>Согласитесь с правилами сайта</div>
        </div>
        <div className="page-register__submit">
          <Button text="Отправить" onClick={this.handleOnClickSubmit} />
        </div>
      </div>
    );
  }

  setDefaultUserData(props) {
    const user = props.user;
    this.props.actions.updateFields({
      last_name: user.last_name,
      first_name: user.first_name,
      middle_name: user.middle_name,
      birthdate: user.birthdate,
      academic_degree: user.academic_degree,
      academic_rank: user.academic_rank,
      city: user.city,
      office: user.office,
      phone: user.phone,
      notifications_allowed: user.notifications_allowed,
    });
  }


  @autobind
  handleOnClosePopup() {
    this.props.history.push('/');
  }

  @autobind
  handleOnChangeInput(e) {
    const value = e.target.value;
    const newFields = dcopy(this.props.fields);

    console.log(newFields, 'newFields');

    if (value !== '') {
      newFields[e.target.id] = value;
    } else {
      newFields[e.target.id] = '';
    }
    this.props.actions.updateFields(newFields);
  }

  @autobind
  handleOnChangeCheckbox(e) {
    const value = e.target.checked;
    const newFields = dcopy(this.props.fields);

    if (value !== '') {
      newFields[e.target.id] = value;
    } else {
      delete newFields[e.target.id];
    }

    this.props.actions.updateFields(newFields);
  }

  @autobind
  handleOnChangeInputDate(newValue, name) {
    const newFields = dcopy(this.props.fields) || {};

    if (newValue !== null && newValue !== '') {
      newFields[name] = newValue;
    } else {
      delete newFields[name];
    }

    this.props.actions.updateFields(newFields);
  }

  @autobind
  handleOnClickSave() {
    const { fields = {} } = this.props;
    const newFormData = {};
    // this.agree_check.style.display = 'none';

    // if (!fields.agree_check) {
    //   this.agree_check.style.display = 'block';
    //   return false;
    // }

    Object.keys(fields).forEach((key) => {
      const item = fields[key];
      let newItem = null;
      if (typeof item === 'object' && key !== 'birthdate') {
        newItem = item.name || null;
      } else if (key === 'birthdate') {
        if (item && item !== null) {
          newItem = moment(item, 'YYYY.MM.DD').format('YYYY-MM-DD');
        }
      } else {
        newItem = item;
      }

      if (newItem !== null) newFormData[key] = newItem;
    });

    // если мы что-то ввели в изменении пароля
    if (this.changePassword1.state.value !== '' && this.changePassword2.state.value !== '') {
      const formData = new FormData();
      formData.append('old_password', this.changePassword1.state.value);
      formData.append('new_password', this.changePassword2.state.value);
      this.props.actions.changePassword(formData, newFormData);
    }

    this.props.actions.editSendForm(newFormData, () => {
      this.props.actions.userGetProfile();
    });
    return true;
  }

  @autobind
  handleOnClickSubmit() {
    const { fields = {} } = this.props;
    const newFormData = {};

    this.agree_check.style.display = 'none';

    if (!fields.agree_check) {
      this.agree_check.style.display = 'block';
      return false;
    }

    Object.keys(fields).forEach((key) => {
      const item = fields[key];
      let newItem = null;

      if (typeof item === 'object') {
        newItem = item.name || null;
      } else if (key === 'birthdate') {
        newItem = moment(item, 'DD.MM.YYYY').format('YYYY-MM-DD');
      } else {
        newItem = item;
      }

      if (newItem !== null) newFormData[key] = newItem;
    });

    this.props.actions.registerSendForm(newFormData);
    return true;
  }

  @autobind
  handlerOnClickSocial(e, type) {
    e.preventDefault();
    const socialTypes = {
      fb: 'facebook',
      vk: 'vk',
      tw: 'twitter',
      ok: 'odnoklassniki',
      google: 'google',
    };
    // this.props.actions.unBindSocial(socialTypes[type]);
    e.target.style.display = 'none';
  }

  getSocialLinksJsx = () => {
    if (!this.props.auth) {
      return (<div className="login__social login__social_profile" />);
    }
    const socialTypes = {
      facebook: 'fb',
      vk: 'vk',
      twitter: 'tw',
      odnoklassniki: 'ok',
      google: 'google',
    };
    // const soc = this.props.user.social_networks.map(item => (
    //   <Social type={socialTypes[item]} className="social_active login__social-item login__social-item_delete" onClick={this.handlerOnClickSocial} />
    // ));

    return (<div className="login__social login__social_profile">
      {this.props.user.social_networks.indexOf('facebook') > -1 ?
        <Social
          onClick={this.handlerOnClickSocial}
          type={'fb'}
          className="login__social-item login__social-item_delete"
        /> :
        <Social
          url={`${URL_API_SOCIAL_LOGIN}?social=facebook&next=${window.location.href}`}
          type={'fb'}
          className="login__social-item"
        /> }
      {this.props.user.social_networks.indexOf('vk') > -1 ?
        <Social
          onClick={this.handlerOnClickSocial}
          type={'vk'}
          className="login__social-item login__social-item_delete"
        /> :
        <Social
          onClick={this.handlerOnClickSocial}
          url={`${URL_API_SOCIAL_LOGIN}?social=vk&next=${window.location.href}`}
          type={'vk'}
          className="login__social-item"
        /> }
      {this.props.user.social_networks.indexOf('tw') > -1 ?
        <Social
          onClick={this.handlerOnClickSocial}
          type={'tw'}
          className="login__social-item login__social-item_delete"
        /> :
        <Social
          onClick={this.handlerOnClickSocial}
          url={`${URL_API_SOCIAL_LOGIN}?social=tw&next=${window.location.href}`}
          type={'tw'}
          className="login__social-item"
        /> }
      {this.props.user.social_networks.indexOf('ok') > -1 ?
        <Social
          onClick={this.handlerOnClickSocial}
          type={'ok'}
          className="login__social-item login__social-item_delete"
        /> :
        <Social
          onClick={this.handlerOnClickSocial}
          url={`${URL_API_SOCIAL_LOGIN}?social=ok&next=${window.location.href}`}
          type={'ok'}
          className="login__social-item"
        /> }
      {this.props.user.social_networks.indexOf('google') > -1 ?
        <Social
          onClick={this.handlerOnClickSocial}
          type={'google'}
          className="login__social-item login__social-item_delete"
        /> :
        <Social
          onClick={this.handlerOnClickSocial}
          url={`${URL_API_SOCIAL_LOGIN}?social=google&next=${window.location.href}`}
          type={'google'}
          className="login__social-item"
        /> }
    </div>);
  }

  @autobind
  agreement(e) {
    this.setState({ isOpenPopupWithArgee: true });
  }

  @autobind
  closeAgree() {
    this.setState({ isOpenPopupWithArgee: false });
  }

  render() {
    const {
      fields = {},
      fieldsErrors = {},
      match: {
        path = '',
      },
    } = this.props;

    const {
      email: errorEmail = '',
      password: errorPassword = '',
      first_name: errorFirstName = '',
      last_name: errorLastName = '',
      middle_name: errorMiddleName = '',
      birthdate: errorBerthdate = '',
      city: errorCity = '',
      office: errorOffice = '',
      academic_degree: errorAcademicDegree = '',
      academic_rank: errorAcademicRank = '',
      phone: errorPhone = '',
    } = fieldsErrors;
    let isEdit = false;

    if (path && path.indexOf('profile/edit') > -1) {
      isEdit = true;
      if (this.props.auth) {
        if (!this.props.user.id) {
          // если нет пользователя, тут делать ему нечего
          // редиректим на главную
          this.props.history.push('/');
        }
      } else {
        return null;
      }
    }

    const submitJSX = this.getSubmitJSX(isEdit);

    // получаем статус отправки успешной регистрации
    const registerStatus = this.getRegisterStatusJSX();

    return (
      <div className="page-register">

        {registerStatus}

        <section className="section page-register__section">
          <div className="container">
            <h1 className="page-register__page-title">{isEdit ? 'Редактирование данных' : 'Регистрация'}</h1>

            <div className="page-register__fields">
              <div className="page-register__fieldset">
                <div className="row">
                  <div className="col_8 col_24-mobile">
                    <Input
                      label="Фамилия"
                      id="last_name"
                      value={fields.last_name || ''}
                      error={errorLastName}
                      onChange={this.handleOnChangeInput}
                    />
                  </div>
                  <div className="col_8 col_24-mobile">
                    <Input
                      label="Имя"
                      id="first_name"
                      value={fields.first_name || ''}
                      error={errorFirstName}
                      onChange={this.handleOnChangeInput}
                    />
                  </div>
                  <div className="col_8 col_24-mobile">
                    <Input
                      label="Отчество"
                      id="middle_name"
                      value={fields.middle_name || ''}
                      error={errorMiddleName}
                      onChange={this.handleOnChangeInput}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col_6 col_18-mobile">
                    <InputDate
                      id="birthdate"
                      name="birthdate"
                      label="Дата рождения"
                      onChangeCb={this.handleOnChangeInputDate}
                      value={fields.birthdate || ''}
                      error={errorBerthdate}
                      placeholder="01.01.1990"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className=" col_8 col_24-mobile">
                    <Input
                      label="Научная степень"
                      id="academic_degree"
                      value={fields.academic_degree || ''}
                      error={errorAcademicDegree}
                      onChange={this.handleOnChangeInput}
                      key={fields.last_name && 'success'}
                    />
                  </div>
                  <div className=" col_12 col_24-mobile">
                    <Input
                      label="Научное звание"
                      id="academic_rank"
                      value={fields.academic_rank || ''}
                      error={errorAcademicRank}
                      onChange={this.handleOnChangeInput}
                      key={fields.last_name && 'success'}
                    />
                  </div>
                </div>
              </div>

              <div className="page-register__fieldset page-register__fieldset_border">
                <div className="page-register__fieldset-title">
                  Ваше место работы
                </div>
                <div className="row">
                  <div className="col_8 col_24-mobile">
                    <Input
                      label="Город"
                      id="city"
                      value={fields.city || ''}
                      error={errorCity}
                      onChange={this.handleOnChangeInput}
                      key={fields.last_name && 'success'}
                    />
                  </div>
                  <div className="col_12 col_24-mobile">
                    <Input
                      label="Название организации"
                      id="office"
                      value={fields.office || ''}
                      error={errorOffice}
                      onChange={this.handleOnChangeInput}
                      key={fields.last_name && 'success'}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
        <section className="section page-register__section section_grey">
          <div className="container">

            <div className="page-register__fields">
              <div className="page-register__fieldset">
                <div className="page-register__fieldset-title">Данные вашей учетной записи</div>
                <div className="row">
                  {
                    !isEdit && (
                      <div className="col_10 col_24-mobile">
                        <Input
                          label="Эл. почта"
                          id="email"
                          value={fields.email || ''}
                          error={errorEmail}
                          onChange={this.handleOnChangeInput}
                        />
                      </div>
                    )
                  }
                  <div className="col_7 col_24-mobile">
                    <InputMask
                      label="Телефон"
                      placeholder="+7 (___) __-__-___"
                      mask="+7 (999) 99-99-999"
                      id="phone"
                      value={fields.phone || ''}
                      error={errorPhone}
                      onChange={this.handleOnChangeInput}
                      key={fields.last_name && 'success'}
                    />
                  </div>
                  <div className="col_7 col_24-mobile">
                    <div className="login__content-row">
                      {this.getSocialLinksJsx()}
                    </div>
                  </div>
                </div>
                {
                  !isEdit && (
                    <div className="row">
                      <div className="col_10 col_24-mobile">
                        <InputPasswordSwitch
                          label="Пароль"
                          id="password"
                          value={fields.password || ''}
                          error={errorPassword}
                          onChange={this.handleOnChangeInput}
                        />
                      </div>
                    </div>
                  )
                }
                {
                  isEdit && (
                    <div className="row">
                      <div className="col_8 col_24-mobile">
                        <InputPasswordSwitch
                          label="Старый пароль"
                          id="password_old"
                          value={fields.password_old || ''}
                          error={this.props.changePasswordError.old_password
                            || (
                              this.props.changePasswordError.detail
                                ? [this.props.changePasswordError.detail]
                                : null
                            )
                            || null}
                          ref={(c) => { this.changePassword1 = c; }}
                          onChange={this.handleOnChangeInput}
                        />
                      </div>
                      <div className="col_8 col_24-mobile">
                        <InputPasswordSwitch
                          label="Новый пароль"
                          id="password_new"
                          value={fields.password_new || ''}
                          error={this.props.changePasswordError.new_password || null}
                          ref={(c) => { this.changePassword2 = c; }}
                          onChange={this.handleOnChangeInput}
                        />
                      </div>
                    </div>
                  )
                }
                <div className="row">
                  <Checkbox
                    id="notifications_allowed"
                    onChange={this.handleOnChangeCheckbox}
                    defaultChecked={fields.notifications_allowed || false}
                    label="Я согласен получать e-mail уведомления"
                    key={fields.notifications_allowed && 'success'}
                  />
                </div>
              </div>
            </div>

            { submitJSX }

          </div>
        </section>
        {this.state.isOpenPopupWithArgee ?
          <Popup
            icon="reg"
            title={'Согласие'}
            wrapperClass={'popup__body-wrapper_big'}
            descriptionClass={'popup__description_left'}
            closeCallback={this.closeAgree}
            description={`<p>Я, субъект персональных данных, в соответствии с Федеральным законом от 27 июля 2006 года № 152 «О персональных данных» предоставляю, АО «Сервье» расположенному по адресу Российская Федерация, 125047, г. Москва, улица Лесная, дом 7. согласие на обработку:</p><ul><li>персональных данных, сбор которых АО «Сервье» осуществляет при использовании сайта в сети «Интернет» <a href="http://cardioteka.ru">http://cardioteka.ru</a> (а также дополнительного программного обеспечения, связанного с сайтом и используемого в АО «Сервье для нужд обработки информации, включая CRM и аналитические системы, но не ограничиваясь ими): IP-адрес, информация из cookie, информация о браузере пользователя (или иной программе, с помощью которой осуществляется доступ к http://cardioteka.ru), время доступа, адрес запрашиваемой страницы сайта <a href="http://cardioteka.ru">http://cardioteka.ru</a> адрес ранее посещенной страницы сайта сети «Интернет», в целях сбор и анализ статистических данных;</li><li>персональных данных, указанных мной на страницах сайта <a href="http://cardioteka.ru">http://cardioteka.ru</a> в сети «Интернет», характер информации которых предполагает или допускает включение в них следующих персональных данных: ФИО, город, место работы, специальность, электронная почта, мобильный телефон, научная степень, научное звание, дата рождения для целей: электронной информационной рассылки, приглашения на мероприятия и вебинары, почтовой рассылки информационных материалов и корреспонденции.</li></ul><p>Согласие предоставляется на совершение следующих действий (операций) с вышеуказанными персональными данными: сбор, систематизацию, накопление, хранение, уточнение (обновление, изменение), использование, передачу (предоставление, доступ), блокирование, удаление, уничтожение, осуществляемых как с использованием средств автоматизации (автоматизированная обработка), так и без использования таких средств (неавтоматизированная обработка).</p><p>Перечень юридических лиц, которым будет осуществляться передача вышеуказанных персональных данных:</p><ul><li> ООО "ГетРеспонз РУС" (Сервис для рассылки электронных сообщений)</li><li>ООО "Вебинар" (Сервис организации веб-трансляций, веб-конференции)</li></ul><p>Согласие действует по достижении целей обработки или в случае утраты необходимости в достижении этих целей, если иное не предусмотрено федеральным законом.</p><p>Согласие может быть отозвано мною в любое время на основании моего письменного заявления.</p>`}
            className="popup_center popup_type_reset"
          /> : ''}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    fields: state.registerForm.fields,
    fieldsErrors: state.registerForm.fieldsErrors,
    formSendSuccess: state.registerForm.formSendSuccess,
    user: state.app.user,
    auth: state.app.auth,
    changePasswordSuccess: state.registerForm.changePasswordSuccess,
    changePasswordError: state.registerForm.changePasswordError,
    editProfileSuccess: state.registerForm.editProfileSuccess,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...RegisterActions, ...AppActions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageRegister);
