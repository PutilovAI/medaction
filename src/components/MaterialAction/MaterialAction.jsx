import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import MaterialActionFavorite from './MaterialActionFavorite';
import MaterialActionShare from './MaterialActionShare';
import MaterialActionAlarm from './MaterialActionAlarm';

import './material-action.css';

export default class MaterialAction extends Component {
  static propTypes = {
    favoritesPatchAction: PropTypes.func,
    subject: PropTypes.shape({}),
    noAlarmComponent: PropTypes.bool,
  }

  static defaultProps = {
    favoritesPatchAction: () => {},
    subject: {},
    noAlarmComponent: true,
  }

  state = {
    popoverOpen: false,
  }
  @autobind
  onPopoverUpdate(isPopoverShow) {
    this.setState({
      popoverOpen: isPopoverShow,
    });
  }

  render() {
    let { className: classMod = '' } = this.props;
    let { popoverOpen } = this.state;
    return (
      <div className={`material-action ${classMod}`} >
        <div className="material-action__container">
          <MaterialActionFavorite
            favoritesPatchAction={this.props.favoritesPatchAction}
            subject={this.props.subject}
          />
          {this.props.noAlarmComponent ?
            <MaterialActionAlarm
              onPopoverUpdate={this.onPopoverUpdate}
              remindersPatchAction={this.props.remindersPatchAction}
              subject={this.props.subject}
              remindersFailure={this.props.remindersFailure}
            /> : ''}
          <MaterialActionShare
            onPopoverUpdate={this.onPopoverUpdate}
          />
        </div>
        <div className={`material-action__shadow ${popoverOpen ? 'state-show' : ''}`} />
      </div>
    );
  }
}
