import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import Icon from '../../components/Icon/Icon';
import './social.css';

export default class Social extends Component {
  static propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.string,
    url: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    url: '',
    onClick: () => {},
    type: '',
  };

  @autobind
  handlerOnClick(e) {
    if (this.props.onClick) {
      this.props.onClick(e, this.props.type);
    }
  }

  render() {
    const { type, url, className: classMod } = this.props;
    if (this.props.onClick && !this.props.url) {
      return (
        <span className={`social ${classMod} social_${type}`} role="button" onClick={this.handlerOnClick} tabIndex="0">
          <Icon icon={`soc_${type}_fill`} className={'social__icon'} />
        </span>
      );
    }
    return (
      <a href={url} className={`social ${classMod} social_${type}`} role="button" tabIndex="0">
        <Icon icon={`soc_${type}_fill`} className={'social__icon'} />
      </a>
    );
  }
}
