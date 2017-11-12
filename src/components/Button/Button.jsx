import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import './button.css';

export default class Button extends Component {
  static propTypes = {
    className: PropTypes.string,
    text: PropTypes.string,
    to: PropTypes.string,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    text: '',
    to: '',
    onClick: () => {},
  }

  render() {
    const {
      className: classMod = '',
      text = '',
      to = null,
    } = this.props;

    let element = null;

    if (to === null || !this.props.to) {
      element = (
        <button className={`button ${classMod}`} onClick={this.props.onClick}>
          <span className="button__text">
            {text}
          </span>

        </button>
      );
    } else {
      element = (
        <NavLink className={`button ${classMod}`} to={to}>
          <span className="button__text">
            {text}
          </span>
        </NavLink>
      );
    }

    return element;
  }
}
