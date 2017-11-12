import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getInitialsName } from 'helpers';
import { lang } from '../../assets/js/lang';

import * as C from '../../constants/app';
import Login from '../../components/Login/Login';
import Button from 'Button';
import Social from '../Social/Social';
import Icon from '../Icon/Icon';

import './menu.css';

export default class MenuLogin extends Component {
  constructor(props) {
    super(props);
    this.handlerClickLoginButton = this.handlerClickLoginButton.bind(this);
    this.handlerClickLoginButtonClose = this.handlerClickLoginButtonClose.bind(this);
    this.onClickExit = this.onClickExit.bind(this);
  }

  onClickExit(e) {
    this.props.userPostLogout();
  }

  handlerClickLoginButton(e) {
    if (document.body.clientWidth < C.RESOLUTION_MOBILE) {
      e.preventDefault();
    }

    this.props.updateStatesMenu({
      openItem: !this.props.isOpen,
      openLogin: !this.props.isOpen,
      open: false,
    });
  }
  handlerClickLoginButtonClose() {
    this.props.updateStatesMenu({
      openItem: false,
      openLogin: false,
    });
  }


  render() {
    const fullName = `${this.props.user.first_name} ${this.props.user.last_name}`;

    const loginNoAuth = (
      <div className={`menu__login ${this.props.isOpen ? ' state-open' : ''}`}>
        <NavLink to="/login" activeClassName="active" className="menu__login-link" onClick={this.handlerClickLoginButton}>
          <Icon icon="key" className="menu__login-link-icon" />
          <div className="menu__login-link-text">{lang('menu', 'login')}</div>
        </NavLink>
        <div className="menu__login-content">
          <div className="menu__login-content-inner">
            <div className="menu__login-content-close" onClick={this.handlerClickLoginButtonClose} role="button" tabIndex="-1" />
            <div className="menu__login-content-title menu__login-content-title_head">{lang('menu', 'login')}</div>

            <div className="menu__login-content-wrapper">
              <Login className="menu__login-form menu__login-form_bg-dark" />
            </div>

          </div>
        </div>
      </div>
    );
    const loginAuth = (
      <div className="menu__login">

        <div className="menu__login-link menu__login-link_auth">
          <NavLink to="/profile" activeClassName="active" className="menu__login-link-img-wrap">
            {this.props.user.avatar ? (<img alt="" src={`${C.URL_API}${this.props.user.avatar}`} className="menu__login-link-img" />) : getInitialsName(fullName) }
          </NavLink>
          <NavLink to="/profile/" activeClassName="active" className="menu__login-link-text menu__login-link-text_auth">{fullName}
          </NavLink>
        </div>
        <div className="menu__login-service">
          <NavLink to="/profile/edit/" className="menu__login-service-link menu__login-service-link_icon">
            <Icon icon="settings" className="menu__login-service-link-icon" />
            <span className="menu__login-service-link-text">{lang('menu', 'settings')}</span>
          </NavLink>
          <span className="menu__login-service-link" onClick={this.onClickExit} role="button" tabIndex="-1">
            <span className="menu__login-service-link-text">{lang('menu', 'logout')}</span>
          </span>
        </div>
      </div>

    );


    return (this.props.auth ? loginAuth : loginNoAuth);
  }
}

MenuLogin.propTypes = {
  isOpen: PropTypes.bool,
  auth: PropTypes.bool,
  user: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    middle_name: PropTypes.string,
    gender: PropTypes.string,
    birthdate: PropTypes.string,
    city: PropTypes.string,
    office: PropTypes.string,
    academic_degree: PropTypes.string,
    academic_rank: PropTypes.string,
    phone: PropTypes.string,
    notifications_allowed: PropTypes.bool,
  }),
  updateStatesMenu: PropTypes.func,
};
MenuLogin.defaultProps = {
  isOpen: false,
  auth: false,
  user: {
    first_name: '',
    last_name: '',
    middle_name: '',
    gender: '',
    birthdate: '',
    city: '',
    office: '',
    academic_degree: '',
    academic_rank: '',
    phone: '',
    notifications_allowed: false,
  },
  updateStatesMenu: () => {},
};
