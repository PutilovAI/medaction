import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MaterialAction from '../../components/MaterialAction/MaterialAction';

import './material.css';

export default class Material extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    favoritesPatchAction: PropTypes.func,
    subject: PropTypes.shape({}),
    remindersPatchAction: PropTypes.func,
    remindersFailure: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
    noAlarmComponent: PropTypes.bool,
  };
  static defaultProps = {
    children: null,
    favoritesPatchAction: () => {},
    subject: {},
    remindersPatchAction: () => {},
    remindersFailure: '',
    noAlarmComponent: true,
  };
  render() {
    return (
      <div className="material">
        {this.props.children}
        <MaterialAction
          noAlarmComponent={this.props.noAlarmComponent}
          favoritesPatchAction={this.props.favoritesPatchAction}
          subject={this.props.subject}
          remindersPatchAction={this.props.remindersPatchAction}
          remindersFailure={this.props.remindersFailure}
        />
      </div>
    );
  }
}
