import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon/Icon';
import { lang } from '../../assets/js/lang';
import './search-result-message.css';

export default class SearchResultMessage extends Component {
  static propTypes = {
    desc: PropTypes.string,
    title: PropTypes.string,
    success: PropTypes.bool,
    className: PropTypes.string,
  };
  static defaultProps = {
    desc: '',
    title: '',
    success: false,
    className: '',
  };
  render() {
    let title = '';
    if (this.props.title === '') {
      if (!this.props.success) {
        title = lang('search', 'not_found');
      }
    }

    return (
      <div className={`search-result-message ${this.props.className}`}>
        <div className="search-result-message__icon-wrap">
          <Icon className="search-result-message__icon" icon={(this.props.success ? 'happy' : 'sad')} />
        </div>
        {(title || this.props.title) && (
          <div className="search-result-message__title">{title || this.props.title}</div>
        )}
        {this.props.desc && (
          <div className="search-result-message__desc">{this.props.desc}</div>
        )}
      </div>
    );
  }
}
