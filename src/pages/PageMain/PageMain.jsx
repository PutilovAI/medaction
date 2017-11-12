import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactDom from 'react-dom';
import { autobind } from 'core-decorators';

import * as AppActions from '../../actions/AppActions';
import * as ArticleActions from '../../actions/ArticleActions';
import * as VideotekaActions from '../../actions/VideotekaActions';
import * as InviteActions from '../../actions/InviteActions';
import * as RegisterActions from '../../actions/RegisterActions';

import './PageMain.css';
import { lang } from '../../assets/js/lang';

import Throbber from '../../components/Throbber/Throbber';
import Popup from '../../components/Popup/Popup';
import BannerAction from '../../components/BannerAction/BannerAction';
import { VideotekaTilesPromo } from '../../components/VideotekaTiles/VideotekaTiles';
import ArticleTiles from '../../components/ArticleTiles/ArticleTiles';
import PromoTile from '../../components/PromoTile/PromoTile';
import Button from '../../components/Button/Button';
import Login from '../../components/Login/Login';
import LoginEmail from '../../components/Login/LoginEmail';
import LoginTest from '../../components/Login/LoginTest';
import LoginEnterEmail from '../../components/Login/LoginEnterEmail';
import Icon from '../../components/Icon/Icon';
// import Notification from '../../components/Notification/Notification';

import * as bannerImage from '../../static/banner-action-2.jpg';
import * as bannerImage3 from '../../static/banner-action-3.png';

export class PageMain extends Component {
  static propTypes = {
    promoMaterial: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object,
    ]),
    promoMaterialError: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object,
    ]),
    promoMaterialLoading: PropTypes.bool,

    videos: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.arrayOf(PropTypes.object),
    ]),
    videosError: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object,
    ]),
    videosLoading: PropTypes.bool,

    articles: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object,
    ]),
    articlesError: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object,
    ]),
    articlesLoading: PropTypes.bool,

    setMainLoaded: PropTypes.bool,

    actions: PropTypes.shape({
      getArticles: PropTypes.func,
      getVideoteka: PropTypes.func,
      getPromoMaterial: PropTypes.func,
      sendInvite: PropTypes.func,
    }),

    user: PropTypes.shape({
      id: PropTypes.number,
      is_test_passed: PropTypes.bool,
      is_email_confirmed: PropTypes.bool,
    }),
    mainLoaded: PropTypes.bool,
    isUserInit: PropTypes.bool,
    inviteResult: PropTypes.bool,
    inviteMessage: PropTypes.string,
  }

  static defaultProps = {
    topArticle: () => {},
    topArticleError: () => {},
    topArticleLoading: () => {},
    videos: false,
    videosError: false,
    videosLoading: false,
    articles: false,
    articlesError: false,
    articlesLoading: false,
    actions: {
      getArticles: () => {},
      getVideoteka: () => {},
      getPromoMaterial: () => {},
      sendInvite: () => {},
    },
    user: {
      is_test_passed: false,
      is_email_confirmed: false,
    },
    setMainLoaded: false,
    mainLoaded: false,
    isUserInit: false,
    inviteResult: false,
    inviteMessage: '',
  }

  state = {
    isOpenPopupWithArgee: false,
  }

  componentDidMount() {
    if (this.props.user
      && this.props.user.is_email_confirmed
      && this.props.user.is_test_passed
      && this.props.user.id) {
      this.getPromo();
      this.getVideos();
      this.getArticles();
    } else if (this.props.isUserInit) {
      this.getArticles();
    }
  }

  componentWillReceiveProps(nextProps) {
    // если авторизовались

    if (!this.props.user.id
      && nextProps.user.id
      && nextProps.user.is_email_confirmed
      && nextProps.user.is_test_passed
      && !this.props.videos
      && !this.props.promoMaterial) {
      this.getPromo();
      this.getVideos();
      this.getArticles();
    }

    //  если пользовать подгрузился, но мы не авторизованы
    if (!nextProps.articlesLoading && !nextProps.articles) {
      this.getArticles();
    }

    if (!this.props.mainLoaded) {
      this.setMainLoaded();
    }
  }

  getPromo() {
    this.props.actions.getPromoMaterial();
  }

  getArticles() {
    this.props.actions.getArticles({ page_size: 6, page: 1 }, true);
  }

  getVideos() {
    this.props.actions.getVideoteka({ page_size: 6, page: 1 }, true);
  }

  getPromoMaterial() {
    this.props.actions.getPromoMaterial();
  }

  getPromoJSX() {
    if (this.props.promoMaterial) {
      return (
        <div className="main-wrap">
          <PromoTile data={this.props.promoMaterial} />
        </div>
      );
    }

    return null;
  }

  getVideotekaJSX() {
    if (this.props.videos) {
      return (
        <div className="main-wrap">
          <h3>Новые видео</h3>
          <VideotekaTilesPromo items={this.props.videos} pageType="promo" />
          <div className="main-wrap__show-all">
            <Button text={lang('main', 'videoMore')} to="/videoteka/" className="button_full-w button_nobg button_height_big button_hover-filled" />
          </div>
        </div>
      );
    }
    return null;
  }

  getArticlesJSX() {
    if (this.props.articles && this.props.articles.results.length) {
      return (
        <div className="main-container main-container_bg_gray">
          <div className="container">
            <h3>Новые материалы</h3>
            <ArticleTiles items={this.props.articles.results} className="article-tiles_pos_main" />
            {
              this.props.user.is_email_confirmed
              && this.props.user.is_test_passed
              && this.props.user.id
                ? <BannerAction
                  title={lang('banner1', 'title')}
                  desc={lang('banner1', 'description')}
                  buttonText={lang('banner1', 'buttonText')}
                  buttonTo="/article/create"
                  img={bannerImage}
                  className="banner-action_bg-dark banner-action_position_main"
                />
                : null
            }

            {(this.props.user
              && this.props.user.is_test_passed
              && this.props.user.is_email_confirmed) ? (
                <Button text={lang('main', 'articlesMore')} to="/articles/" className="button_full-w button_nobg button_height_big button_hover-filled" />
              ) : null
            }
          </div>
        </div>
      );
    }

    return null;
  }

  getBannerJSX = () => (
    <BannerAction
      title={lang('banner3', 'title')}
      desc={lang('banner3', 'description')}
      buttonText={lang('banner3', 'buttonText')}
      buttonTo={null}
      sendInvite={this.props.actions.sendInvite}
      inviteResult={this.props.inviteResult}
      inviteMessage={this.props.inviteMessage}
      contentModifier="banner-action__content_big"
      img={bannerImage3}
      type={2}
    />
  )

  getAuthJSX = () => {
    const user = this.props.user;
    let authTemplate = null;
    // const className = '';

    // если юзер есть, но он не подтвержден
    if (user.id) {
      if (user && user.email.indexOf('.dummy') > -1) {
        authTemplate = (
          <div className="page-login__col page-login__col_form page-login__col_form_main">
            <div className="page-login__form-wrap">
              <LoginEnterEmail className="">
                <p className="login-email__title" dangerouslySetInnerHTML={{ __html: lang('forms', 'verifyEnterEmailTitle') }} />
                <p className="login-email__description" dangerouslySetInnerHTML={{ __html: lang('forms', 'verifyEnterEmailDescription') }} />
                <form onSubmit={this.enterEmailSubmit} className="container container_no-padding">
                  <div className="row">
                    <div className="col_24">
                      <div className="input input_text">
                        <label className="input__label" htmlFor="resendEmail">
                          <div className="input__label-text">
                            эл.почта
                          </div>
                        </label>
                        <input id="resendEmail" className="input__field" name="email" pattern="^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$" required />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col_24">
                      <button
                        type="submit"
                        className="button"
                      >{lang('forms', 'verifyEnterEmailButton')}</button>
                    </div>
                  </div>
                </form>
              </LoginEnterEmail>
            </div>
          </div>
        );
      } else if (!user.is_email_confirmed) {
        authTemplate = (
          <div className="page-login__col page-login__col_form page-login__col_form_main">
            <div className="page-login__form-wrap">
              <LoginEmail className="login-email_main" agreementClick={this.agreement} />
            </div>
          </div>
        );
      } else if (!user.is_test_passed) {
        authTemplate = (
          <div className="page-login__col page-login__col_form page-login__col_form_main">
            <div className="page-login__form-wrap">
              <LoginTest moveToTest={this.moveToTest} className="login-email_test" />
            </div>
          </div>
        );
      }
    } else {
      authTemplate = (
        <div className="page-login__col page-login__col_form page-login__col_form_main">
          <div className="page-login__form-wrap">
            <div className="page-login__form-title">
              <Icon icon="key" className="page-login__form-title-icon" />
              <div className="page-login__form-title-text">{lang('menu', 'login')}</div>
            </div>
            <Login />
          </div>
        </div>
      );
    }

    return (<div className="container">
      <div className="main-auth">
        <div className="main-auth__text">
          <div className="main-auth__title">{THEME.name}</div>
          {THEME.slogan ? <div className="main-auth__slogan">{THEME.slogan}</div> : ''}
          <div className="main-auth__description" dangerouslySetInnerHTML={{ __html: THEME.description }} />
        </div>
      </div>
      {authTemplate}
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
    </div>);
  };

  getAboutJSX = () => (
    <div className="main-container">
      <div className="container">
        <h3>Учитесь и делитесь опытом</h3>
        <div className="main-about">
          <div className="main-about__item">
            <div className="main-about__icon">
              <Icon icon="videoteka" className="main-about__icon-elem" />
            </div>
            <div className="main-about__content">
              <p className="main-about__content-title" dangerouslySetInnerHTML={{ __html: lang('main', 'aboutTitle4') }} />
              <p className="main-about__content-description" dangerouslySetInnerHTML={{ __html: lang('main', 'aboutDescr4') }} />
            </div>
          </div>
          <div className="main-about__item">
            <div className="main-about__icon">
              <Icon icon="ivent" className="main-about__icon-elem" />
            </div>
            <div className="main-about__content">
              <p className="main-about__content-title" dangerouslySetInnerHTML={{ __html: lang('main', 'aboutTitle1') }} />
              <p className="main-about__content-description" dangerouslySetInnerHTML={{ __html: lang('main', 'aboutDescr1') }} />
            </div>
          </div>
          <div className="main-about__item">
            <div className="main-about__icon">
              <Icon icon="article" className="main-about__icon-elem" />
            </div>
            <div className="main-about__content">
              <p className="main-about__content-title" dangerouslySetInnerHTML={{ __html: lang('main', 'aboutTitle3') }} />
              <p className="main-about__content-description" dangerouslySetInnerHTML={{ __html: lang('main', 'aboutDescr3') }} />
            </div>
          </div>
          <div className="main-about__item">
            <div className="main-about__icon">
              <Icon icon="konsilium" className="main-about__icon-elem" />
            </div>
            <div className="main-about__content">
              <p className="main-about__content-title" dangerouslySetInnerHTML={{ __html: lang('main', 'aboutTitle2') }} />
              <p className="main-about__content-description" dangerouslySetInnerHTML={{ __html: lang('main', 'aboutDescr2') }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  setMainLoaded() {
    this.props.actions.setMainLoaded();
  }

  @autobind
  agreement() {
    this.setState({ isOpenPopupWithArgee: true });
  }

  @autobind
  closeAgree() {
    this.setState({ isOpenPopupWithArgee: false });
  }

  @autobind
  enterEmailSubmit(e) {
    e.preventDefault();
    const formElements = e.target.elements;
    const data = {
      email: formElements.email.value,
      next: '/',
    };
    this.props.actions.editSendForm(data, () => {
      this.props.actions.userGetProfile();
    });
  }

  moveToTest = () => {
    this.props.history.push('/register/quiz');
  }

  render() {
    let componentsToRender = null;

    if (this.props.articlesLoading
      || this.props.videosLoading
      || this.props.promoMaterialLoading
      || !this.props.mainLoaded) {
      // componentsToRender = <Throbber className="throbber_full" />;
      // componentsToRender = <LoadingBar loading={50} />;
    } else if (this.props.user
      && this.props.user.id
      && this.props.user.is_test_passed
      && this.props.user.is_email_confirmed) {
      // если авторизованы и все тесты пройдены и email подтвержден
      componentsToRender = (
        <section className="section">
          {/* <Throbber className="throbber_full" />
          <Throbber className="throbber" /> */}
          <div className="container">
            {this.getPromoJSX()}
          </div>
          {
            this.props.videos.length ?
              <div className="container">
                {this.getVideotekaJSX()}
              </div> : null
          }
          {
            this.props.articles && this.props.articles.results.length
              ? this.getArticlesJSX() : null
          }
          <div className="main-container main-container_margin_null">
            <div className="container">
              {this.getBannerJSX()}
            </div>
          </div>
        </section>
      );
    } else {
      componentsToRender = (
        <section className="section">
          {this.getAuthJSX()}
          {this.getAboutJSX()}
          {this.getArticlesJSX()}
        </section>
      );
    }

    return componentsToRender;
  }
}

function mapStateToProps(state) {
  return {
    articles: state.articles.listSummary,
    articlesError: state.articles.listSummaryError,
    articlesLoading: state.articles.listSummaryLoading,

    videos: state.videoteka.videosSummary,
    videosError: state.videoteka.videosSummaryError,
    videosLoading: state.videoteka.videosLoading,

    promoMaterial: state.app.promoMaterial,
    promoMaterialError: state.app.promomaterialError,
    promoMaterialLoading: state.app.promoMaterialLoading,

    user: state.app.user,
    mainLoaded: state.app.mainLoaded,
    isUserInit: state.app.isUserInit,

    inviteMessage: state.invite.inviteMessage,
    inviteResult: state.invite.inviteResult,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...AppActions,
        ...ArticleActions,
        ...VideotekaActions,
        ...InviteActions,
        ...RegisterActions,
      },
      dispatch,
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageMain);
