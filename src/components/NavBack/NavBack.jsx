import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '../../components/Icon/Icon';
import './nav-back.css';

const NavBack = data => (
  data.onClick
    ? (
      <span className="nav-back" onClick={data.onClick || (() => {})}>
        <Icon icon={'arrow_left'} className="nav-back__icon" />
        {data.title || ''}
      </span>
    )
    : (
      <NavLink className="nav-back" to={data.to || ''}>
        <Icon icon={'arrow_left'} className="nav-back__icon" />
        {data.title || ''}
      </NavLink>
    )
);

export default NavBack;
