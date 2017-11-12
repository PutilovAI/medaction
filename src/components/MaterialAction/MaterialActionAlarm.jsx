import React, { Component } from 'react';
import * as dcopy from 'deep-copy';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { lang } from '../../assets/js/lang';
import MaterialActionPopover from './MaterialActionPopover';
import { Checkbox } from '../../components/Input/InputComponents';
import Icon from '../../components/Icon/Icon';

import './material-action.css';

export default class MaterialActionAlarm extends Component {
  static propTypes = {
    remindersPatchAction: PropTypes.func,
    onPopoverUpdate: PropTypes.func,
    className: PropTypes.string,
    subject: PropTypes.shape({
      reminders: PropTypes.shape({
        ten_minutes: PropTypes.bool,
        one_hour: PropTypes.bool,
        one_day: PropTypes.bool,
      }),
    }),
  };

  static defaultProps = {
    remindersPatchAction: () => {},
    onPopoverUpdate: () => {},
    className: '',
    subject: {
      reminders: {
        ten_minutes: false,
        one_hour: false,
        one_day: false,
      },
    },
  };

  state = {
    popoverOpen: false,
    alarmTime: {},
    tempAlarmTime: {},
    alarmActive: false,
  };
  componentWillReceiveProps(nextProps) {
    // TODO: запилить обновление компонента на fail
    if (this.props.remindersFailure !== nextProps.remindersFailure) {
      this.forceUpdate();
    }
  }
  componentWillUnmount() {
    document.body.removeEventListener('click', this.handlerBodyClick);
  }

  @autobind
  onChangeHandler(e) {
    const { checked, name } = e.target;
    const newTime = dcopy(this.state.tempAlarmTime);

    if (checked) {
      newTime[name] = checked;
    } else {
      delete newTime[name];
    }

    this.setState({
      tempAlarmTime: newTime,
    });
  }

  @autobind
  onClickIconHandler() {
    this.setState({
      popoverOpen: !this.state.popoverOpen,
    }, () => {
      if (this.state.popoverOpen) {
        document.body.addEventListener('click', this.handlerBodyClick);
      }
      if (this.props.onPopoverUpdate) {
        this.props.onPopoverUpdate(this.state.popoverOpen);
      }
    });
  }

  popoverClose() {
    this.setState({
      popoverOpen: false,
      tempAlarmTime: dcopy(this.state.alarmTime),
    }, () => {
      document.body.removeEventListener('click', this.handlerBodyClick);
      if (this.props.onPopoverUpdate) {
        this.props.onPopoverUpdate(false);
      }
    });
  }

  // Чтобы можно было удалить событие
  handlerBodyClick = (e) => {
    const target = e.target;
    if (!target.closest('.material-action__item_alarm')) {
      this.popoverClose();
    }
  }

  @autobind
  applySettings(e) {
    e.preventDefault();
    const formElements = e.target.elements;

    let alarmActive = false;
    if (Object.keys(this.state.tempAlarmTime).length) {
      alarmActive = true;
    }

    this.setState({
      alarmTime: dcopy(this.state.tempAlarmTime),
      alarmActive,
    }, () => {
      this.popoverClose();
    });
    const alarmObject = {
      ten_minutes: formElements.ten_minutes.checked,
      one_hour: formElements.one_hour.checked,
      one_day: formElements.one_day.checked,
    };
    this.props.remindersPatchAction(alarmObject);
  }

  render() {
    // const { onPopoverUpdate } = this.props;
    const { className: classMod = '' } = this.props;
    const { popoverOpen } = this.state;
    let alarmActive = false;
    if (this.props.subject.reminders.ten_minutes ||
      this.props.subject.reminders.one_hour ||
      this.props.subject.reminders.one_day) {
      alarmActive = true;
    }
    return (
      <div className="material-action__panel">
        <div className={`material-action__item material-action__item_head material-action__item_alarm ${classMod}`} ref="alarm">
          <div className="material-action__item-link" role="button" tabIndex={-1} onClick={this.onClickIconHandler}>
            <div className={`material-action__item-icon-wrap material-action__item-icon-wrap_alarm ${alarmActive ? 'state-active' : ''}`} >
              <Icon icon={(alarmActive ? 'alarm_clock_fill' : 'alarm_clock')} />
            </div>
            <div className="material-action__item-title">
              {lang('material', 'remind')}
            </div>
          </div>
          <MaterialActionPopover isOpen={popoverOpen} target={this}>
            <div>
              <div className="material-action__popover-title">{lang('material', 'reminder')}</div>
              <div className="material-action__popover-title-second">{lang('material', 'reminder_time')}</div>
              <form className="material-action__popover-controls" onSubmit={this.applySettings}>
                <div className="material-action__popover-control-row">
                  <Checkbox
                    label="За 10 минут до начала"
                    attr={{ name: '10min' }}
                    id={'ten_minutes'}
                    defaultChecked={this.props.subject.reminders.ten_minutes || false}
                    onChangeCb={this.onChangeHandler}
                  />
                </div>
                <div className="material-action__popover-control-row">
                  <Checkbox
                    label="За 1час до начала"
                    id={'one_hour'}
                    defaultChecked={this.props.subject.reminders.one_hour || false}
                    attr={{ name: 'hour' }}
                    onChangeCb={this.onChangeHandler}
                  />
                </div>
                <div className="material-action__popover-control-row">
                  <Checkbox
                    label="За 24 часа до начала"
                    id={'one_day'}
                    defaultChecked={this.props.subject.reminders.one_day || false}
                    attr={{ name: 'day' }}
                    onChangeCb={this.onChangeHandler}
                  />
                </div>
                <div className="material-action__popover-control-row">
                  <button className="material-action__popover-control-apply">{lang('material', 'apply')}</button>
                </div>
              </form>
            </div>

          </MaterialActionPopover>
        </div>
      </div>
    );
  }
}
