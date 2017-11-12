import React from 'react';
import { NavLink } from 'react-router-dom';

import Login from 'components/Login/Login';
import Icon from 'Icon';

import './page-login.css';

const PageLogin = () => (
  <div className="page-login">
    <section className="page-login__section">
      <div className="container">

        <NavLink to="/" className="page-login__logo">
          <Icon icon="logo_cardioteka_white_color" className="page-login__logo-icon" />
          <span className="page-login__logo-text">Кардиотека</span>
        </NavLink>

        <div className="page-login__content">
          <div className="page-login__row">
            <div className="page-login__col page-login__col_desc">
              <div className="page-login__title">Cardioteka</div>
              <div className="page-login__title-second">Веб-конференции от ведущих экспертов кардиологии и терапии</div>
              <div className="page-login__list-title">В цикле Кардиотекат вас ждут обсуждения и разборы:</div>
              <ul className="page-login__list">
                <li className="page-login__list-item">возможностей диагностики заболеваний;</li>
                <li className="page-login__list-item">спорных вопросов лечения;</li>
                <li className="page-login__list-item">различных аспектах ведения пациентов.</li>
              </ul>
            </div>
            <div className="page-login__col page-login__col_form">
              <div className="page-login__form-wrap">
                <div className="page-login__form-title">
                  <Icon icon="key" className="page-login__form-title-icon" />
                  <div className="page-login__form-title-text">Авторизация</div>
                </div>
                <Login />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

  </div>
);


export default PageLogin;
