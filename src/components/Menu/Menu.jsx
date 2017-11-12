import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { autobind } from 'core-decorators';

import * as AppActions from '../../actions/AppActions';
import * as C from '../../constants/app';
// import { getInitialsName } from '../../assets/js/helpers';
import { lang } from '../../assets/js/lang';
import MenuAim from '../../assets/js/menuAim';
const md5 = require('md5');

import MenuLogin from './MenuLogin';
import Button from '../Button/Button';
// import Social from '../Social/Social';
import Icon from '../Icon/Icon';


import './menu.css';

const MenuServiceItem = (props) => {
  let {
    icon,
    text,
    letter,
    mod: itemMod = '',
    to = '/' } = props;

  let color = '';
  switch (letter) {
    case 'N':
      color = 'blue';
      break;
    case 'Х':
      color = 'main';
      break;
    case 'Ф':
      color = 'blue-dark';
      break;
    case 'О':
      color = 'red';
      break;
    case 'П':
      color = 'green';
      break;
    default:
      break;
  }

  itemMod += color ? ` menu__service-item_color-${color}` : '';
  return (
    <div className={`menu__service-item ${itemMod}`}>
      <a href={to} className="menu__service-item-link">
        {icon && <Icon icon={icon} className="menu__service-item-icon" />}
        {letter && (
          <div className="menu__service-item-letter">{letter}</div>
        )}

        <div className="menu__service-item-text">{text}</div>
      </a>
    </div>
  );
};

const MenuItem = (props) => {
  let menuitem = null;
  // if (props.expand) {
  menuitem = props.extLink ? (<a href={props.to} onClick={props.onClick} target="_blank" className="menu__item-link">
    {props.icon && <Icon icon={props.icon} className="menu__item-icon" />}
    <div className="menu__item-text">{props.text}</div>
  </a>) : (<NavLink to={props.to} activeClassName="active" className="menu__item-link">
    {props.icon && <Icon icon={props.icon} className="menu__item-icon" />}
    <div className="menu__item-text">{props.text}</div>
  </NavLink>);
  // } else {
  //   menuitem = (<div className="menu__item-link">
  //     {props.icon && <Icon icon={props.icon} className="menu__item-icon" />}
  //     <div className="menu__item-text">{props.text}</div>
  //   </div>);
  // }

  return (<div className="menu__item js-menu-aim__item" data-children={props.children ? 'true' : 'false'}>
    {/* js-menu-aim__item */}
    {menuitem}
    <div className="menu__item-content js-menu-aim__item-content">
      <div className="menu__item-content-inner">
        {props.children}
      </div>
    </div>
  </div>);
};

export class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openItem: false,
      expand: false,
      open: false,
      openLogin: false,
    };
    this.menuAim = null;

    this.updateStates = this.updateStates.bind(this);
    this.handlerClickSandwich = this.handlerClickSandwich.bind(this);
    this.handlerMenuMouseEnter = this.handlerMenuMouseEnter.bind(this);
    this.handlerMenuMouseLeave = this.handlerMenuMouseLeave.bind(this);
    this.handlerMenuShadowMouseEnter = this.handlerMenuShadowMouseEnter.bind(this);
    this.handlerMenuShadowClick = this.handlerMenuShadowClick.bind(this);
  }

  componentDidMount() {
    this.menuAimInit();
    this.getItemsMenu();
  }
  componentWillReceiveProps(nextProps) {
    // если произошел переход на другой урл
    if (nextProps.location.pathname !== this.props.location.pathName) {
      this.handlerClickSandwich();
    }
    if (nextProps.auth !== this.props.auth) {
      this.menuAim.exitMenu();
      setTimeout(() => { this.menuAimInit(); this.getItemsMenu(); }, 1000);
    }
  }
  // запрашиваем айтемы для меню
  getItemsMenu() {
    this.props.actions.getMaterialsItemToMenu();
  }
  // обновляем стейт меню
  updateStates(data) {
    this.setState(Object.assign({}, this.state, data));
  }
  menuAimInit() {
    const elMenu = findDOMNode(this);
    let relatedTarget = null;

    this.menuAim = new MenuAim({
      el_menu: elMenu.querySelector('.menu__container'),
      __row: '.js-menu-aim__item',
      __submenu: '.js-menu-aim__item-content',
      mouseleaveRow: mouseleaveItem,
    });
    const menuAim = this.menuAim;

    const updateStates = this.updateStates;

    function itemClose(item) {
      menuAim.activeRow = null;
      item.classList.remove('state-open');

      updateStates({
        openItem: false,
      });
    }
    function itemOpen(item) {
      // проверяем этот плагин на наличие датаатрибута
      // потому что иначе он не ставит обработчик на открытие пустой вкладки
      // и какбы, блин, логично. Зачем нам открывать вкладку, если она пустая
      // но открытую то надо закрыть, раз новую не надо открывать
      if (item.getAttribute('data-children') === 'false') {
        return false;
      }
      item.classList.add('state-open');
      updateStates({
        openItem: true,
      });
      return true;
    }

    function mouseleaveItem(e, activeItem) {
      // itemClose(activeItem);
      // debugger
      relatedTarget = e.relatedTarget;

      // if (e.relatedTarget.parentNode.parentNode.classList.value.indexOf('js-menu-aim__item')) {
      //   itemClose(activeItem);
      // }
    }

    menuAim.deactivate = () => {
      const wW = document.body.offsetWidth;
      if (wW < C.RESOLUTION_MOBILE) return;

      const { activeRow, el_menu } = menuAim;

      if (!activeRow) return;

      const inputs = el_menu.querySelectorAll('input:focus');

      if (inputs.length) {
        if (relatedTarget && relatedTarget.closest('.menu__container')) {
          itemClose(activeRow);
        }
      } else {
        itemClose(activeRow);
      }
    };

    menuAim.activate = (item) => {
      const wW = document.body.offsetWidth;
      if (wW < C.RESOLUTION_MOBILE) return;

      const { activeRow } = menuAim;

      if (item === activeRow) {
        return;
      }

      if (activeRow) {
        menuAim.deactivate();
      }

      menuAim.activeRow = item;
      itemOpen(item);
    };

    menuAim.exitMenu = () => {
      const wW = document.body.offsetWidth;
      if (wW < C.RESOLUTION_MOBILE) return;

      menuAim.deactivate();
      updateStates({
        openItem: false,
        expand: false,
      });
    };
  }

  handlerClickSandwich() {
    this.updateStates({
      open: !this.state.open,
      openLogin: false,
    });
  }
  handlerMenuMouseEnter() {
    const wW = document.body.offsetWidth;
    if (wW < C.RESOLUTION_MOBILE) return;

    this.updateStates({
      expand: true,
    });
  }
  handlerMenuMouseLeave() {
    const wW = document.body.offsetWidth;
    if (wW < C.RESOLUTION_MOBILE) return;

    this.updateStates({
      expand: false,
    });
  }
  handlerMenuShadowMouseEnter() {
    const wW = document.body.offsetWidth;
    if (wW < C.RESOLUTION_MOBILE) return;

    this.updateStates({
      expand: false,
    });
  }
  handlerMenuShadowClick() {
    this.handlerMenuShadowMouseEnter();
    this.menuAim.exitMenu();
  }

  @autobind
  submitMenuSearch(e) {
    e.preventDefault();
    const formElements = e.target.elements;
    this.props.history.push(`/articles?search_query=${formElements.menu_search.value}`);
  }

  @autobind
  handleReserchClick() {
    const HEADERS = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      credentials: 'include',
      mode: 'no-cors',
    };

    const MEDACTION_API_URL = 'https://medaction.ru/api';
    const MEDACTION_LOGIN_URL = `${MEDACTION_API_URL}/phleboteka/login`;
    const MEDACTION_LOGIN_SALT = '80dd578c3fda411fb4a6a2ba84f6d262';

    const data = `mail=${this.props.user.email}&token=${md5(MEDACTION_LOGIN_SALT + this.props.user.email)}&name=${this.props.user.first_name || ''}&secondName=${this.props.user.last_name || ''}&city=${this.props.user.city || ''}`;

    const successStatusCodes = [0, 200, 201, 202, 203, 304];

    fetch(MEDACTION_LOGIN_URL, Object.assign({}, HEADERS, {body: data}))
      .then((response) => {
        // иначе преобразуем данные в json
        return response
          .text()
          .then(json => ({ data: json, status: response.status }));
      })
      .then((result) => {
        if (successStatusCodes.indexOf(result.status) > -1) {
          window.location = 'https://medaction.ru/research';
        } else {
          window.location = 'https://medaction.ru/research';
        }
      })
      .catch((ex) => {
        window.location = 'https://medaction.ru/research';
      });
  }

  render() {
    const {
      auth,
      user,
    } = this.props;

    const menuClassMod = `${this.state.openItem ? 'state-open-item' : ''} ${this.state.expand ? 'state-expanded' : ''} ${this.state.open ? 'state-open' : ''}`;

    let isAuth = false;

    if (user && user.id && user.is_email_confirmed && user.is_test_passed) {
      isAuth = true;
    }
    let materialMenuItems = [];
    if (this.props.materialMenuItems && this.props.materialMenuItems.length > 0) {
      materialMenuItems = this.props.materialMenuItems.map(item => (
        <li key={item.id} className="menu__list-link-item">
          <NavLink to={`/articles?theme=${item.id}`} className="menu__link">{item.name}</NavLink>
        </li>
      ));
      materialMenuItems = (<div className="menu__item-content-row">
        <div className="menu__item-content-wrapper">
          <ul className="menu__list-link">{materialMenuItems}</ul>
        </div>
      </div>);
    }

    return (
      <div
        className={`menu ${THEME.menu_class} ${menuClassMod}`}
        onMouseEnter={this.handlerMenuMouseEnter}
        onMouseLeave={this.handlerMenuMouseLeave}
      >
        <div className="menu__shadow" onMouseEnter={this.handlerMenuShadowMouseEnter} onClick={this.handlerMenuShadowClick} role="button" tabIndex="-1" />
        <div className="menu__sandwich" onClick={this.handlerClickSandwich} role="button" tabIndex="-1" />
        <div className="menu__container">
          <div className="menu__wrapper">
            <div className="menu__container-inner">
              <div className="menu__logo">
                <NavLink to="/" className="menu__logo-link" >
                  <Icon icon={`logo_${THEME.logo}_color`} className="menu__logo-icon" />
                  <div className="menu__logo-text">{THEME.name}</div>
                </NavLink>
              </div>
              {isAuth && (
                <div className="menu__items">

                  <form className="menu__search" onSubmit={this.submitMenuSearch}>
                    <input type="text" name="menu_search" className="menu__search-input" />
                    <button className="menu__search-button" />
                  </form>
                  <MenuItem to="/articles" text="Материалы" icon="ivent" expand={this.state.expand} >
                    <div className="menu__item-content-row">
                      <div className="menu__item-content-wrapper">
                        <Icon icon="ivent" className="menu__content-title-icon" />
                      </div>
                    </div>

                    {materialMenuItems}

                    <div className="menu__item-content-row">
                      <div className="menu__item-content-wrapper">
                        <div className="menu__content-title" dangerouslySetInnerHTML={{ __html: lang('menu', 'share_exp') }} />
                        <div className="menu__content-text" dangerouslySetInnerHTML={{ __html: lang('menu', 'share_exp_text') }} />
                        <Button text="Отправить материал" className="button_full-w" to="/article/create/" />
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem to="/consilium" text="Консилиум" icon="konsilium" expand={this.state.expand} />
                  <MenuItem to="/news" text="Новости" icon="secret_files" expand={this.state.expand} />
                  {THEME.menu_class !== 'menu_default' ?
                    <MenuItem to="/videoteka" text="Видеотека" icon="videoteka" expand={this.state.expand}>
                      <div className="menu__item-content-row">
                        <div className="menu__item-content-wrapper">
                          <Icon icon="videoteka" className="menu__content-title-icon" />
                        </div>
                      </div>

                      <div className="menu__item-content-row">
                        <div className="menu__item-content-wrapper">
                          <ul className="menu__list-link">
                            <li className="menu__list-link-item">
                              <NavLink to="/videoteka?type=l" className="menu__link">Онлайн-лекции</NavLink>
                            </li>
                            <li className="menu__list-link-item">
                              <NavLink to="/videoteka?type=w" className="menu__link">Вебинары</NavLink>
                            </li>
                            <li className="menu__list-link-item">
                              <NavLink to="/profile/favorites" className="menu__link">Мои избранные видео</NavLink>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </MenuItem>
                    : <MenuItem to="/videoteka" text="Видеотека" icon="videoteka" expand={this.state.expand} />}
                  {(THEME.menu_class === 'menu_fleboteka' && this.props.hasResearch) ?
                    <MenuItem onClick={this.handleReserchClick} extLink text="Исследования" icon="research" expand={this.state.expand} />
                    : ''}
                  {/* <MenuItem to="/webinar" text="Вебинары" icon="webinar" /> */}
                  {/* <MenuItem to="/articles" text="Статьи" icon="article" /> */}

                </div>
              )}

              {!isAuth ?
                <div className="menu__items">
                  <MenuItem to="/articles" text="Материалы" icon="ivent" expand={this.state.expand} />
                </div> : ''
              }

              <div className="menu__service">
                <div className="menu__service-title">{lang('menu', 'services')}</div>
                <div className="menu__service-items">
                  {
                    this.props.allServices
                      ? this.props.allServices.map(item => (
                        <MenuServiceItem
                          to={`${window.location.protocol}//${item.hostname}`}
                          text={item.site_name}
                          letter={item.site_name.slice(0, 1)}
                          key={item.hostname}
                        />),
                      )
                      : null
                  }
                </div>
              </div>

            </div>
          </div>

          <MenuLogin
            auth={auth}
            updateStatesMenu={this.updateStates}
            userPostLogout={this.props.actions.userPostLogout}
            user={user}
            isOpen={this.state.openLogin}
          />
        </div>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.app.auth,
    user: state.app.user,
    materialMenuItems: state.app.materialMenuItems,
    allServices: state.app.allServices,
    hasResearch: state.app.hasResearch,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(AppActions, dispatch),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Menu));

Menu.propTypes = {
  auth: PropTypes.bool,
  hasResearch: PropTypes.bool,
  materialMenuItems: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
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
  actions: PropTypes.objectOf(PropTypes.func),
  history: PropTypes.shape({
    push: PropTypes.function,
  }),
};
Menu.defaultProps = {
  auth: false,
  materialMenuItems: [],
  hasResearch: false,
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
  actions: {},
  history: {
    push: () => {},
  },
};
