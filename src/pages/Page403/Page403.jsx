import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import * as queryString from 'query-string';

import * as AppActions from '../../actions/AppActions';

import './page-403.css';

import { lang } from '../../assets/js/lang';
import Login from '../../components/Login/Login';
import Popup from '../../components/Popup/Popup';
import LoginEmail from '../../components/Login/LoginEmail';
import LoginTest from '../../components/Login/LoginTest';
import Icon from '../../components/Icon/Icon';

class Page403 extends Component {
  static propTypes = {
    user: PropTypes.shape({
      id: PropTypes.number,
      is_test_passed: PropTypes.bool,
      is_email_confirmed: PropTypes.bool,
    }),
    location: PropTypes.shape({
      search: PropTypes.string,
    }),
  }

  static defaultProps = {
    user: {
      is_test_passed: false,
      is_email_confirmed: false,
    },
    isUserInit: false,
    location: {
      search: '',
    },
  }

  state = {
    isOpenPopupWithArgee: false,
  }

  componentDidMount() {
    this.checkUserAuth(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkUserAuth(nextProps);
  }

  // если юзер уже авторизован и все ок, ему нечего делать на этом экране
  // кидаем его на GET-экран или на главную
  checkUserAuth(props) {
    if (props.isUserInit && props.user.is_test_passed && props.user.is_email_confirmed) {
      const query = queryString.parse(this.props.location.search);
      if (query.from) {
        props.history.push(decodeURIComponent(query.from));
      } else {
        props.history.push('/');
      }
    }
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
    const user = this.props.user;
    let loginTemplate = null;
    let classNamePage = '';

    // если юзер есть, но он не подтвержден
    if (user.id) {
      if (!user.is_email_confirmed) {
        classNamePage = 'page-403_auth';
        loginTemplate = (
          <div className="container">
            <div className="page-403__auth">
              <div className="page-403__auth-text">
                <div className="page-403__auth-icon-wrap">
                  <Icon icon="locked_fill" className="page-403__auth-icon" />
                </div>
                <LoginEmail agreementClick={this.agreement} className="login-email_main login-email_page-error" />
              </div>
            </div>
          </div>
        );
      } else if (!user.is_test_passed) {
        classNamePage = 'page-403_auth';
        loginTemplate = (
          <div className="container">
            <div className="page-403__auth">
              <div className="page-403__auth-text">
                <div className="page-403__auth-icon-wrap">
                  <Icon icon="locked_fill" className="page-403__auth-icon" />
                </div>
                <LoginTest moveToTest={this.moveToTest} className="login-email_test login-email_page-error" />;
              </div>
            </div>
          </div>
        );
      }
    } else {
      loginTemplate = (
        <div className="container">
          <div className="page-403__auth">
            <div className="page-403__auth-text">
              <div className="page-403__auth-icon-wrap">
                <Icon icon="locked_fill" className="page-403__auth-icon" />
              </div>
              <div className="page-403__auth-title">{lang('page403', 'title')}</div>
              <div className="page-403__auth-description">{lang('page403', 'description')}</div>
            </div>
          </div>
          <div className="page-login__col page-login__col_form page-login__col_form_main">
            <div className="page-login__form-wrap">
              <Login />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`page-403 ${classNamePage}`}>
        <section className="page-403__section">
          {loginTemplate}
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
    user: state.app.user,
    isUserInit: state.app.isUserInit,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...AppActions },
      dispatch,
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Page403);
