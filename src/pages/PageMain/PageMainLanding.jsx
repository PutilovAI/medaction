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
import BannerAction from '../../components/BannerAction/BannerAction';
import ArticleTiles from '../../components/ArticleTiles/ArticleTiles';
import Button from '../../components/Button/Button';
import LoginWelcome from '../../components/Login/LoginWelcome';
import Icon from '../../components/Icon/Icon';

import * as bannerImage from '../../static/banner-action-2.jpg';
import * as bannerImage3 from '../../static/banner-action-3.png';

export class PageMainLanding extends Component {
  static propTypes = {
    setMainLoaded: PropTypes.bool,

    actions: PropTypes.shape({
      getArticles: PropTypes.func,
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
    actions: {
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

  componentDidMount() {
    if (THEME.name_eng !== 'Phleboteka') {
      this.props.history.push('/');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.mainLoaded) {
      this.setMainLoaded();
    }
  }

  getAuthJSX = () => {
    let authTemplate = null;
    authTemplate = (
      <div className="page-login__col page-login__col_form page-login__col_form_main">
        <div className="page-login__form-wrap">
          <div className="page-login__form-title">
            <Icon icon="key" className="page-login__form-title-icon" />
            <div className="page-login__form-title-text">{lang('menu', 'login')}</div>
          </div>
          <LoginWelcome />
        </div>
      </div>
    );

    return (<div className="container">
      <div className="main-auth">
        <div className="main-auth__text main-auth__text_welcome">
          <div className="main-auth__title main-auth__title_welcome">Добро пожаловать на&nbsp;портал!</div>
          <div className="main-auth__description">
            Мы&nbsp;рады приветствовать Вас на&nbsp;нашем новом портале для хирургов и&nbsp;флебологов <strong className="main-auth__strong">Phleboteka.ru</strong>.<br /><br />
            Phleboteka.ru – сайт преемник <strong className="main-auth__strong">MedAction.ru</strong>.
          </div>
        </div>
      </div>
      {authTemplate}
    </div>);
  };

  getAboutJSX = () => (
    <div className="main-container">
      <div className="container">
        <h3>Новые возможности</h3>
        <div className="main-about">
          <div className="main-about__item main-about__item_welcome">
            <div className="main-about__icon">
              <Icon icon="happy" className="main-about__icon-elem" />
            </div>
            <div className="main-about__content">
              <p className="main-about__content-title">
                Теперь Вы&nbsp;сможете использовать сайт не&nbsp;только для внесения информации по&nbsp;исследованию, но&nbsp;и&nbsp;для того, чтобы узнать последние научные новости, познакомиться с&nbsp;научно-практическими статьями, посмотреть веб-конференцию, обсудить с&nbsp;коллегами интересный клинический случай.
              </p>
            </div>
          </div>
        </div>
      </div>
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

  render() {
    let componentsToRender = null;
    componentsToRender = (
      <section className="section">
        {this.getAuthJSX()}
        {this.getAboutJSX()}
      </section>
    );

    return componentsToRender;
  }
}

function mapStateToProps(state) {
  return {
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
        ...InviteActions,
        ...RegisterActions,
      },
      dispatch,
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageMainLanding);
