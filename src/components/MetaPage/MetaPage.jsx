import React from 'react';
import PropTypes from 'prop-types';

import './meta-page.css';

export default class MetaPage extends React.Component {
  static propTypes = {
    mod: PropTypes.string,
    left: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
    ]),
    right: PropTypes.string,
  }
  static defaultProps = {
    mod: '',
    left: null,
    right: '',
  }
  render() {
    return (
      <div className={`meta-page ${this.props.mod ? this.props.mod : ''}`}>
        <div className="meta-page__left">{this.props.left}</div>
        {this.props.right ? <div className="meta-page__right">{this.props.right}</div> : ''}
      </div>
    );
  }
}
