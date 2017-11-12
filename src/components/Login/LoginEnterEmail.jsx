import React, { Component } from 'react';
import PropTypes from 'prop-types';


import { lang } from '../../assets/js/lang';

import './login.css';

class LoginEnterEmail extends Component {
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
      {this.props.children}
    </div>);
  }
}

export default LoginEnterEmail;
