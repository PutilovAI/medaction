import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as AppActions from '../../actions/AppActions';
import Button from '../../components/Button/Button';
import './page-404.css';

const Page404 = () => (
  <div className="page-404">
    <section className="page-404__section">
      <div className="container">
        <div className="page-404">
          <div className="page-404__error">
            <div className="page-404__img"></div>
            <div className="page-404__title">Эта страница <nobr>не существует :(</nobr></div>
            <div className="page-404__desc">Возможно она была удалена или вы&nbsp;указали неверный адрес.</div>
            <div className="page-404__button-wrap">
              <Button text="Перейти на главную" to="/" />
            </div>
          </div>
        </div> 
      </div>
    </section>
  </div>
);


export default Page404;
