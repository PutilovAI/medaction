import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// import ReactCrop from 'react-image-crop';
import Cropper from 'react-cropper';
import { NavLink } from 'react-router-dom';
import { autobind } from 'core-decorators';
// import petrovich from 'petrovich';
// https://github.com/petrovich/petrovich-js

import './cropper.css';

import { lang } from '../../assets/js/lang';
import * as C from '../../constants/profile';
import Icon from '../../components/Icon/Icon';
import Button from '../Button/Button';
import Popup from '../../components/Popup/Popup';
import { Input } from '../../components/Input/InputComponents';
import ReviewemindersList from '../../components/RemindersList/RemindersList';
import Archive from '../../components/Archive/Archive';
import BannerAction from '../../components/BannerAction/BannerAction';
import LoginEmail from '../../components/Login/LoginEmail';
import LoginTest from '../../components/Login/LoginTest';
import LoginEnterEmail from '../../components/Login/LoginEnterEmail';
import ArticleTiles from '../../components/ArticleTiles/ArticleTiles';
import './profile-head.css';

const bannerImg = require('../../static/banner-action-2.jpg');
const bannerImg3 = require('../../static/banner-action-3.png');


export default class Profile extends Component {
  static propTypes = {
    summary: PropTypes.oneOfType([
      PropTypes.shape({
        favorites: PropTypes.number,
        reminders: PropTypes.number,
        comments: PropTypes.number,
        problems: PropTypes.number,
        articles: PropTypes.number,
        article_requests: PropTypes.number,
        videos: PropTypes.number,
      }),
      PropTypes.bool,
    ]),
    reminders: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({}),
    ]),
    remindersPatch: PropTypes.func,
    articlesList: PropTypes.oneOfType([
      PropTypes.shape({
        results: PropTypes.arrayOf(
          PropTypes.object,
        ),
      }),
      PropTypes.bool,
    ]),
    className: PropTypes.string,
    user: PropTypes.shape({
      avatar: PropTypes.string,
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      middle_name: PropTypes.string,
      birthdate: PropTypes.string,
      city: PropTypes.string,
      office: PropTypes.string,
      academic_degree: PropTypes.string,
      academic_rank: PropTypes.string,
    }),
    curUser: PropTypes.shape({
      is_email_confirmed: PropTypes.bool,
      email: PropTypes.string,
    }),
    me: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
    ]),
    logout: PropTypes.func,
    profileChangePhoto: PropTypes.func,
    editSendForm: PropTypes.func,
    resendEmailSuccess: PropTypes.bool,
  };

  static defaultProps = {
    summary: {},
    articlesList: false,
    className: '',
    curUser: {
      is_email_confirmed: false,
      email: '',
    },
    remindersPatch: () => {},
    user: {
      avatar: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      birthdate: '',
      city: '',
      office: '',
      academic_degree: '',
      academic_rank: '',
    },
    me: false,
    logout: () => {},
    profileChangePhoto: () => {},
    editSendForm: () => {},
    resendEmailSuccess: false,
  };

  state = {
    dropzone: '',
    firstImage: '',
    firstImageSource: '',
    isPopupOpen: false,
    isOpenPopupWithArgee: false,
    crop: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    }
  };

  getRemindersJSX = () => {
    let returnData = null;

    if (this.props.reminders && this.props.reminders.count > 0) {
      returnData = (
        <div className="container">
          <h3>Мои напоминания</h3>
          <ReviewemindersList data={this.props.reminders} remindersPatch={this.props.remindersPatch} />
        </div>
      );
    }

    return returnData;
  }

  getSummaryJSX = () => (
    <div className="container">
      <h3>Мой архив</h3>
      <Archive summary={this.props.summary} />
    </div>
  )

  getArticlesJSX = () => {
    let body = null;
    // TODO доделать склонение
    // const person = {
    //   gender: 'female',
    //   first: 'Анастасия',
    // };
    // console.log(petrovich(person, 'genitive'))

    if (this.props.articlesList.results && this.props.articlesList.results.length) {
      body = <div className="container"><ArticleTiles items={this.props.articlesList.results} /></div>;
    } else {
      body = <div className="container"><h3>Пока нет публикаций</h3></div>;
    }
    return body;
  }

  @autobind
  handleDropzoneOnChange(e) {
    const files = e.target.files;

    if (!files.length) return;

    this.dropzoneHandleFiles.call(this, files);
  }

  @autobind
  handleDropzoneOnDrop(e) {
    e.stopPropagation();
    e.preventDefault();

    const files = e.dataTransfer.files;

    if (!files.length) return;

    this.dropzoneHandleFiles.call(this, files);

    this.setState({
      dropzone: '',
    });
  }

  @autobind
  handleDropzoneOnDragEnter(e) {
    e.stopPropagation();
    e.preventDefault();
    const cont = this.dropzoneContainer;
    cont.style.pointerEvents = 'none';

    this.setState({
      dropzone: 'dragenter',
    });
  }

  handleDropzoneOnDragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();
  }

  @autobind
  handleDropzoneOnDragLeave(e) {
    e.stopPropagation();
    e.preventDefault();

    this.setState({
      dropzone: '',
    });
  }

  dropzoneHandleFiles(files) {
    const reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (e) => {
      const base64URL = e.target.result;
      this.setState({
        firstImage: base64URL,
        firstImageSource: files[0],
        isPopupOpen: true,
      });
    };
    reader.readAsDataURL(files[0]);
  }

  @autobind
  clickCropFinish() {
    this.cropper.getCroppedCanvas().toBlob((image) => {
      const file = new File([image], 'image');
      const formData = new FormData();
      formData.append('avatar', file);
      this.props.profileChangePhoto(formData);
      this.clickCropClear();
    }, 'image/jpeg', 0.95);
    // this.getCroppedImg(this.state.firstImageSource, this.state.crop).then((image) => {
    //   const file = new File([image], 'image');
    //   const formData = new FormData();
    //   formData.append('avatar', file);
    //   this.props.profileChangePhoto(formData);
    //   this.clickCropClear();
    // });
  }

  @autobind
  clickCropClear() {
    this.dropzone_field.value = '';
    this.setState({
      isPopupOpen: false,
      firstImage: false,
      firstImageSource: false,
    });
  }

  @autobind
  enterEmailSubmit(e) {
    e.preventDefault();
    const formElements = e.target.elements;
    const data = {
      email: formElements.email.value,
    };
    this.props.editSendForm(data);
  }

  @autobind
  agreement() {
    this.setState({ isOpenPopupWithArgee: true });
  }

  @autobind
  closeAgree() {
    this.setState({ isOpenPopupWithArgee: false });
  }

  render() {
    const {
      className,
      user: {
        avatar,
        first_name: firstName,
        last_name: lastName,
        middle_name: middleName,
        birthdate,
        city,
        office,
        academic_degree: academicDegree,
        academic_rank: academicRank,
        id: userId = false,
      },
      me = false,
    } = this.props;
    let stylesAvatarWrap = avatar ? { backgroundImage: `url(${C.URL_API}${avatar})` } : {};
    let reminders = null;
    let summary = null;
    let articles = null;
    // если это наш профиль, то его можно редактировать
    let isEditable = false;
    let requeireVerify = null;
    if (me === userId) {
      isEditable = true;

      if (this.props.curUser && !this.props.curUser.is_email_confirmed) {
        if (this.props.curUser && !this.props.curUser.is_test_passed) {
          requeireVerify = <LoginTest className="login-email_profile" />;
        }

        // если успешно отправили верификацию
        if (this.props.resendEmailSuccess) {
          requeireVerify = (
            <LoginEmail className="login-email_profile login-email_profile_success" agreementClick={this.agreement} >
              <Icon icon="acept" className="login-email_profile__icon" />
            </LoginEmail>
          );
        } else {
          requeireVerify = <LoginEmail className="login-email_profile"  agreementClick={this.agreement} />;
        }
      }

      // если чел пришел без почты из соцсетей

      if (this.props.curUser && this.props.curUser.email.indexOf('.dummy') > -1) {
        requeireVerify = (
          <LoginEnterEmail className="login-email_profile login-email_profile_success">
            <p className="login-email__title" dangerouslySetInnerHTML={{ __html: lang('forms', 'verifyEnterEmailTitle') }} />
            <p className="login-email__description" dangerouslySetInnerHTML={{ __html: lang('forms', 'verifyEnterEmailDescription') }} />
            <form onSubmit={this.enterEmailSubmit} className="container container_no-padding">
              <div className="row">
                <div className="col_16">
                  <div className="input input_text">
                    <label className="input__label" htmlFor="resendEmail">
                      <div className="input__label-text">
                        эл.почта
                      </div>
                    </label>
                    <input id="resendEmail" className="input__field" name="email" pattern="^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$" required />
                  </div>
                </div>
                <div className="col_8">
                  <button
                    type="submit"
                    className="button login-email__button"
                  >{lang('forms', 'verifyEnterEmailButton')}</button>
                </div>
              </div>
            </form>
          </LoginEnterEmail>
        );
      }
      reminders = this.getRemindersJSX();
      summary = this.getSummaryJSX();
    } else {
      articles = this.getArticlesJSX();
    }

    let roleStr = '';
    const roles = [];


    if (academicRank) roles.push(academicRank.trim());
    if (academicDegree) roles.push(academicDegree.trim());

    roles.forEach((item, ind) => {
      if (ind === 0) {
        roles[ind] = item[0].toUpperCase() + item.slice(1);
      }
    });

    roleStr = roles.join(', ');

    return (
      <div className="page-profile">
        <section className="">
          <div className="container">
            <div className={`profile-head ${className}`}>
              <div className="profile-head__container">
                <div className="profile-head__col profile-head__col_photo">
                  <div className="profile-head__photo-wrap" style={stylesAvatarWrap}>
                    {isEditable && (
                      <label
                        className={`profile-head__dropzone ${this.state.dropzone}`}
                        onDragEnter={this.handleDropzoneOnDragEnter}
                        onDragOver={this.handleDropzoneOnDragOver}
                        onDrop={this.handleDropzoneOnDrop}
                        onDragLeave={this.handleDropzoneOnDragLeave}
                        htmlFor={'profile-head__dropzone-field'}
                      >
                        <input
                          id="profile-head__dropzone-field"
                          type="file"
                          accept="image/*"
                          className="profile-head__dropzone-field"
                          onChange={this.handleDropzoneOnChange}
                          ref={(c) => { this.dropzone_field = c; }}
                        />
                        <div className={`profile-head__dropzone-container ${(avatar?'profile-head__dropzone-container_noempty' : '')}`} ref={(c) => { this.dropzoneContainer = c; }}>
                          {!avatar &&
                          <div>
                            <Icon className="profile-head__dropzone-icon" icon="photo" />
                            <div className="profile-head__dropzone-link">
                              <span className="profile-head__dropzone-link-text">
                                Загрузить фотографию
                              </span>
                            </div>
                          </div>
                          }
                          {avatar && (
                            <Icon className="profile-head__dropzone-icon profile-head__dropzone-icon_min" icon="photo" />
                          )}
                        </div>
                      </label>
                    )}
                    {!isEditable && !avatar && (
                      <div className="profile-head__photo-stub">
                        <Icon icon="medic_color" />
                      </div>
                    )}
                  </div>

                  {isEditable && (
                    <div className="profile-head__controls">
                      <button className="profile-head__control profile-head__control_edit">
                        <Icon className="profile-head__control-icon" icon="pencil" />
                        <NavLink to="/profile/edit/" className="profile-head__control-text">Редактировать профиль</NavLink>
                      </button>
                      <button className="profile-head__control profile-head__control_exit">
                        <span className="profile-head__control-text" onClick={this.props.logout} role="button" tabIndex="0">Выход</span>
                      </button>
                    </div>
                  )}

                </div>
                {/* end photo */}

                <div className="profile-head__col profile-head__col_info">
                  <div className="profile-head__name">{`${lastName} ${firstName} ${middleName}`}</div>

                  <ul className="profile-head__list">
                    {birthdate && (
                      <li className="profile-head__list-item">
                        <Icon icon="calendar" className="profile-head__list-item-icon" />
                        {moment(birthdate).format('DD MMMM YYYY')}
                      </li>
                    )}
                    {city && (
                      <li className="profile-head__list-item">
                        <Icon icon="location" className="profile-head__list-item-icon" />
                        {city}
                      </li>
                    )}
                    {office && (
                      <li className="profile-head__list-item">
                        <Icon icon="job" className="profile-head__list-item-icon" />
                        {office}
                      </li>
                    )}
                  </ul>

                  {roleStr && (
                    <div className="profile-head__role">{roleStr}</div>
                  )}

                </div>
              </div>
              {(this.state.isPopupOpen && this.state.firstImage) && (
                <div className="profile-head__popup">
                  <div className="profile-head__popup-wrapper">
                    <div className="profile-head__popup-container">
                      <button className="profile-head__popup-close" onClick={this.clickCropClear} />
                      <div className="profile-head__popup-content">

                        <div className="profile-head__popup-title-wrap">
                          <div className="profile-head__popup-title">Фотография на вашей странице</div>
                          <div className="profile-head__popup-title-desc">Выбранная область будет показываться на Вашей странице.</div>
                        </div>

                        <div className="profile-head__popup-cropper-wrap">
                          <Cropper
                            ref={(c) => { this.cropper = c; }}
                            aspectRatio={1}
                            src={this.state.firstImage}
                            style={{ height: 400, width: '100%' }}
                            crop={this.onCrop}
                          />
                        </div>

                        <div className="profile-head__popup-buttons">
                          <Button
                            onClick={this.clickCropFinish}
                            text="Сохранить"
                          />
                          <Button
                            onClick={this.clickCropClear}
                            text="Отменить"
                            className="button_cancel"
                          />
                        </div>

                        {this.state.resultImagePreview && (
                          <img src={this.state.resultImagePreview} alt="" />
                        )}

                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        {
          requeireVerify && (
            <section className="section">
              <div className="container">
                {requeireVerify}
              </div>
            </section>
          )
        }

        <section className="section section_grey">
          {articles}
          {reminders}
          {summary}
        </section>
        <section className="section">
          <div className="container">
            {
              (this.props.user && this.props.is_test_passed && this.props.is_email_confirmed)
                && (<BannerAction
                  title={lang('banner1', 'title')}
                  desc={lang('banner1', 'description')}
                  buttonText={lang('banner1', 'buttonText')}
                  buttonTo="/article/create"
                  img={bannerImg}
                  className="banner-action_bg-dark"
                />)
            }
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
