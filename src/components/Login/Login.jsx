import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import { URL_API_SOCIAL_LOGIN } from '../../constants/app';

import * as AppActions from '../../actions/AppActions';
import * as EmailActions from '../../actions/EmailActions';

import Button from '../Button/Button';
import { lang } from '../../assets/js/lang';

import Social from '../Social/Social';

import './login.css';

class Login extends Component {
  static propTypes = {
    authErrors: PropTypes.oneOfType([
      PropTypes.shape({
        email: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
        password: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
      }),
      PropTypes.bool,
    ]),
    authErrorsStatus: PropTypes.number,
    className: PropTypes.string,
    actions: PropTypes.shape({
      clearRemind: PropTypes.func,
      sendRemind: PropTypes.func,
      socialLogin: PropTypes.func,
      userPostLogin: PropTypes.func,
    }),
    remindLoading: PropTypes.bool,
    remindSuccess: PropTypes.bool,
  };

  static defaultProps = {
    authErrors: {
      email: null,
      password: null,
    },
    authErrorsStatus: null,
    className: '',
    userPostLogin: () => {},
    actions: {
      clearRemind: () => {},
      sendRemind: () => {},
      socialLogin: () => {},
      userPostLogin: () => {},
    },
    remindLoading: false,
    remindSuccess: false,
    remindError: false,
  };

  componentWillReceiveProps() {
    if (this.props.remindSuccess) {
      this.props.actions.clearRemind();
    }
  }

  componentWillUnmount() {
    if (this.props.remindSuccess) {
      this.props.actions.clearRemind();
    }
  }

  getSocialJSX = () => (<div className="login__content-row">
    <div className="login__social-title">{lang('menu', 'login_social')}</div>
    <div className="login__social">
      <Social url={`${URL_API_SOCIAL_LOGIN}?social=facebook&next=${window.location.href}`} type={'fb'} className="login__social-item" />
      <Social url={`${URL_API_SOCIAL_LOGIN}?social=vk&next=${window.location.href}`} type={'vk'} className="login__social-item" />
      <Social url={`${URL_API_SOCIAL_LOGIN}?social=twitter&next=${window.location.href}`} type={'tw'} className="login__social-item" />
      <Social url={`${URL_API_SOCIAL_LOGIN}?social=odnoklassniki&next=${window.location.href}`} type={'ok'} className="login__social-item" />
      <Social url={`${URL_API_SOCIAL_LOGIN}?social=google&next=${window.location.href}`} type={'google'} className="login__social-item" />
    </div>
  </div>)

  // заполняем форму полями
  getLoginFormJSX(props) {

    const {
      authErrors: {
        email: errorEmail = null,
        password: errorPassword = null,
      },
      authErrorsStatus,
    } = props;
    let errorDescription = null;
    if (authErrorsStatus === 404) {
      errorDescription = {
      email: 'Пользователь с таким e-mail не найден',
      };
    } else if (authErrorsStatus === 500) {
      errorDescription = {
        email: 'Ошибка сервера, попробуйте позже',
      };
    }
    return (<div className="login__content-row">
      <form onSubmit={this.handlerOnSubmit} className="login__form">
        <div className={`login__input ${errorEmail ? 'state-error' : ''}`}>
          <input
            type="email"
            className="login__input-field"
            placeholder="E-mail"
            ref={(c) => { this.fieldEmail = c; }}
            name="login_user_email"
          />

          {(errorDescription || errorEmail) && (
            <div className="login__input-error">{(errorDescription && errorDescription.email) ? errorDescription.email : errorEmail}</div>
          )}

        </div>
        <div className={`login__input ${errorPassword ? 'state-error' : ''}`}>
          <input
            type="password"
            className="login__input-field login__input-field_remind"
            placeholder="Пароль"
            ref={(c) => { this.fieldPassword = c; }}
            name="login_user_password"
          />
          <span className="login__input-link login__input-link_remind" onClick={this.handlerSendRemind} role="button" tabIndex="0">
            {lang('menu', 'remind')}
          </span>
          {(errorDescription || errorPassword) && (
            <div className="login__input-error">{(errorDescription && errorDescription.password) ? errorDescription.password : errorPassword}</div>
          )}
        </div>
        <div className="login__form-row login__form-row_buttons">
          <Button
            text="Войти"
            type="submit"
            className="login__button-enter"
          />
          <NavLink to="/register" className="login__form-link login__form-link_reg">{lang('menu', 'reg')}</NavLink>
        </div>
      </form>
    </div>);
  }

  // формируем новый контент формы, если пришел успех от ресета пароля
  getRemindSuccessJSX = () => (
    <div className="login__content-row">
      <p className="login__content-text" dangerouslySetInnerHTML={{ __html: lang('forms', 'remindSuccess') }} />
    </div>
  );

  @autobind
  handlerOnSubmit(e) {
    e.preventDefault();
    let bodyForm = {};
    bodyForm = {
      email: this.fieldEmail.value,
      password: this.fieldPassword.value,
    };
    this.props.actions.userPostLogin(bodyForm);
  }

  @autobind
  handlerOnClickSocial(socialName) {
    this.props.actions.socialLogin(socialName);
  }

  @autobind
  handlerSendRemind() {
    // если в данный момент не отправляется запрос
    if (!this.props.remindLoading) {
      this.props.actions.sendRemind({
        email: this.fieldEmail.value,
      });
    }
  }

  render() {
    let componentToRender = null;

    if (this.props.remindSuccess) {
      componentToRender = this.getRemindSuccessJSX();
    } else {
      componentToRender = this.getLoginFormJSX(this.props);
    }

    return (
      <div className={`login ${this.props.className ? this.props.className : ''}`}>
        <div className="login__content">
          { componentToRender }
          { this.getSocialJSX() }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authErrors: state.app.authErrors,
    remindLoading: state.app.remindLoading,
    remindSuccess: state.app.remindSuccess,
    authErrorsStatus: state.app.authErrorsStatus,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...AppActions, ...EmailActions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
