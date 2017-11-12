import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon/Icon';
import './tabs.css';

export default class TabItem extends Component {
  constructor(props) {
    super(props);
    this.handleOnClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.updateActive(this.props.id);
  }
  render() {
    const {
      className: classMod,
      icon,
      title,
      active,
    } = this.props;

    return (
      <div className={`tabs__item ${classMod} ${active ? 'state-active' : ''}`} onClick={active ? (() => false) : this.handleOnClick} role="button" tabIndex={0}>
        {icon && (
          <Icon icon={icon} className="tabs__item-icon" />
        )}
        <span className="tabs__item-title">{title}</span>
      </div>
    );
  }
}

TabItem.propTypes = {
  updateActive: PropTypes.func,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  className: PropTypes.string,
  icon: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.string,
  ]),
  title: PropTypes.string,
  active: PropTypes.bool,
};

TabItem.defaultProps = {
  updateActive: () => {},
  id: 0,
  className: '',
  icon: null,
  title: '',
  active: false,
};
