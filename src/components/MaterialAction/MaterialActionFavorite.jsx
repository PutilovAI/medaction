import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { lang } from '../../assets/js/lang';

import Icon from '../../components/Icon/Icon';

import './material-action.css';

export default class MaterialActionFavorite extends Component {
  static propTypes = {
    favoritesPatchAction: PropTypes.func,
    subject: PropTypes.shape({
      favorite: PropTypes.bool,
    }),
    className: PropTypes.string,
  };
  static defaultProps = {
    favoritesPatchAction: () => {},
    subject: {
      favorite: false,
    },
    className: '',
  };
  @autobind
  onClickFavorite() {
    const action = this.props.subject.favorite ? { action: 'unset' } : { action: 'set' };
    this.props.favoritesPatchAction(action);
  }
  render() {
    const { className: classMod = '' } = this.props;
    return (
      <div className="material-action__panel">
        <div className={`material-action__item material-action__item_head material-action__item_favorite ${classMod}`}>
          <div className="material-action__item-link" role="button" tabIndex={0} onClick={this.onClickFavorite} >
            <div className={`material-action__item-icon-wrap material-action__item-icon-wrap_favorite ${this.props.subject.favorite ? 'state-active' : ''}`}>
              <Icon icon={(this.props.subject.favorite ? 'star' : 'star_line')} />
            </div>
            <div className="material-action__item-title">
              {this.props.subject.favorite ? lang('material', 'in_fav') : lang('material', 'to_fav')}
            </div>
          </div>
          <div className="material-action__item-popover-notice">
            <div className="material-action__item-popover-content-notice">{this.props.subject.favorite ? lang('material', 'in_fav') : lang('material', 'to_fav')}</div>
          </div>
        </div>
      </div>
    );
  }
}
