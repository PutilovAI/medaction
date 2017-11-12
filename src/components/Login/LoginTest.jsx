import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '../Button/Button';
import { lang } from '../../assets/js/lang';

import './login.css';

class LoginTest extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.element,
  };

  static defaultProps = {
    className: '',
    children: null,
  };

  render() {
    return (<div className={`login-email ${this.props.className ? this.props.className : ''}`}>
      <p className="login-email__title" dangerouslySetInnerHTML={{ __html: lang('forms', 'verifySuccessTitle') }} />
      <p className="login-email__description" dangerouslySetInnerHTML={{ __html: lang('forms', 'verifySuccessDescription') }} />
      <Button
        className="login-email__button"
        text={lang('forms', 'verifySuccessButton')}
        to="/register/quiz"
      />
      {this.props.children}
    </div>);
  }
}

export default LoginTest;
