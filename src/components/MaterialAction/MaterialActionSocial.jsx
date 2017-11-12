import React, { Component } from 'react';
import { ShareCounts } from 'react-share';
import PropTypes from 'prop-types';

import Icon from '../../components/Icon/Icon';

import './material-action.css';

export default class MaterialActionSocial extends Component {
  static propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    icon: PropTypes.string,
  };
  static defaultProps = {
    className: '',
    name: '',
  };
  // TODO: необоходимо разобраться, почему дефаулт пропс для иконки гасит все
  render() {
    const {
      className: classMod = '',
      name,
    } = this.props;
    const {
      FacebookShareCount,
      VKShareCount,
      OKShareCount,
    } = ShareCounts;
    const shareUrl = window.location.href;
    let children = null;
    let {
      icon,
    } = this.props;
    if (typeof icon === 'undefined') {
      icon = `soc_${name}`;
    }
    // https://github.com/nygardk/react-share плагин для шар
    switch (name) {
      case 'fb':
        children = (<FacebookShareCount url={shareUrl}>
          {shareCount => (<span className="material-action-social__count">{shareCount}</span>)}
        </FacebookShareCount>);
        break;
      case 'vk':
        children = (<VKShareCount url={shareUrl}>
          {shareCount => (<span className="material-action-social__count">{shareCount}</span>)}
        </VKShareCount>);
        break;
      case 'ok':
        children = (<OKShareCount url={shareUrl}>
          {shareCount => (<span className="material-action-social__count">{shareCount}</span>)}
        </OKShareCount>);
        break;
      case 'tw':
        children = <span className="material-action-social__count">0</span>;
        break;
      default:
        children = null;
    }
    return (
      <div className={`material-action-social ${classMod} material-action-social_${name}`} >
        <div className="material-action-social__icon-wrap">
          <Icon icon={icon} className="material-action-social__icon" />
        </div>
        {children}
      </div>
    );
  }
}
