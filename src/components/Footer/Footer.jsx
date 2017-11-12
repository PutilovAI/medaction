import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter, NavLink } from 'react-router-dom';
import * as AppActions from '../../actions/AppActions';
import { lang } from '../../assets/js/lang';
import './footer.css';

export class Footer extends Component {
  static propTypes = {
    allServices: PropTypes.arrayOf(
      PropTypes.shape,
    ),
  };
  static defaultProps = {
    allServices: [],
  }

  getFooterServiceItemJsx = (to, text, icon, letter) => (<div key={to} className="footer__service-item">
    <a href={to} target="_blank" className="footer__service-item-link">
      <div className={`footer__service-item-icon ${icon && `footer__service-item-icon_${icon}`}`}>{letter}</div>
      <div className="footer__service-item-text">{text}</div>
    </a>
  </div>
  );
  render() {
    const footerServices = [];
    for (let i = 0; i < this.props.allServices.length; i += 1) {
      footerServices.push(this.getFooterServiceItemJsx(
        `${window.location.protocol}//${this.props.allServices[i].hostname}`,
        this.props.allServices[i].site_name,
        '',
        this.props.allServices[i].site_name.slice(0, 1),
      ));
    }

    return (
      <footer className="footer">
        <div className="footer__container">
          <div className="footer__row">
            <div className="footer__title">
              <span className="footer__title-text"><span className="footer__title-text footer__title-text_name">{THEME.name_eng}</span> &mdash; {THEME.name_tagline}</span>
            </div>
            <div className="footer__links">
              {/*
                <NavLink to="/static-pages/about-project" className="footer__link">{lang('footer', 'about')}</NavLink>
                <NavLink to="/static-pages/site-guide" className="footer__link">{lang('footer', 'guide')}</NavLink>
              */}
              <a href="http://www.servier.ru/content/%D0%BA%D0%BE%D0%BD%D1%82%D0%B0%D0%BA%D1%82%D0%BD%D0%B0%D1%8F-%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8F" className="footer__link">{lang('footer', 'farmaSecurity')}</a>
              {/* <a href="mailto:mail@cardio.ru" className="footer__link footer__link_callme">mail@cardio.ru</a> */}
            </div>
          </div>
          <div className="footer__row">
            <div className="footer__service">
              <div className="footer__service-title">{lang('footer', 'services')}</div>
              <div className="footer__service-items">
                {footerServices}
              </div>
            </div>
          </div>
          <div className="footer__row footer__row_copyright">
            <div className="footer__copyright">Copyright &copy; 2017, Medaction. {THEME.name_eng}. All Rights Reserved</div>
          </div>
        </div>
      </footer>
    );
  }
}

function mapStateToProps(state) {
  return {
    allServices: state.app.allServices,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(AppActions, dispatch),
  };
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Footer));
