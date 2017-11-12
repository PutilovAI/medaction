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

class LoginWelcome extends Component {
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
        password: 'Неверный пароль',
        email: 'Неверный e-mail',
      };
    } else if (authErrorsStatus === 500) {
      errorDescription = {
        email: 'Ошибка сервера, попробуйте позже',
      };
    }
    return (<div className="login__content-row">
      <p>Для сохранения безопасности Вашей информации мы просим Вас ввести новый пароль.</p>
      <p>Для этого введите ваш e-mail и следуйте инструкциям в письме.</p>
      <div className="login__form">
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
        <div className="login__form-row login__form-row_medaction">
          <Button
            text="Отправить письмо"
            onClick={this.handlerSendRemind}
            className="login__button-enter"
          />
        </div>
      </div>
      <p className="login__form-footer"><br />Или <NavLink to="/register" className="login__form-link">зарегистрируйтесь</NavLink></p>
    </div>);
  }

  // формируем новый контент формы, если пришел успех от ресета пароля
  getRemindSuccessJSX = () => (
    <div className="login__content-row">
      <p className="login__content-text" dangerouslySetInnerHTML={{ __html: lang('forms', 'remindSuccess') }} />
    </div>
  );

  @autobind
  handlerSendRemind() {
    // если в данный момент не отправляется запрос
    if (!this.props.remindLoading) {
      this.props.actions.sendRemind({
        email: this.fieldEmail ? this.fieldEmail.value : '',
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginWelcome);
