import React from 'react';
import { autobind } from 'core-decorators';
import moment from 'moment';
import { DateRange } from 'react-date-range';

import Input from './Input';
import './input.css';
import Icon from '../Icon/Icon';

export default class InputDateRange extends Input {
  state = {
    inputState: '',
    value: '',
    countSelects: 0,
    isOpen: false,
    theme: {
      DateRange: {
        boxShadow: '0 3px 7px rgba(0,0,0,0.2)',
      },
      Calendar: {
        width: '218px',
      },
      MonthAndYear: {
        borderBottom: '1px dotted rgba(0,0,0,0.3)',
      },
      Weekday: {
        fontWeight: 'normal',
        color: THEME.color_main,
        paddingTop: '7px',
        paddingBottom: '3px',
        height: 'auto',
        width: 28,
      },
      Day: {
        width: 28,
        height: 28,
        borderRadius: '50%',
        lineHeight: '28px',
        color: 'rgba(0,0,0,0.8)',
      },
      DayInRange: {
        background: THEME.color_main_light,
        color: '',
      },
      MonthButton: {
        margin: '0',
        background: 'none',
      },
      MonthArrow: {
        display: '',
        width: '',
        height: '',
        padding: '',
        margin: '',
        border: '',
        textAlign: '',
      },
    },
  };

  @autobind
  onFocusCb() {
    this.setState({
      isOpen: true,
    });
  }
  @autobind
  onBlurCb() {
    this.setState({
      isOpen: false,
    });
  }
  @autobind
  onChangeCb(e) {
    const {
      onChangeCb: onChangeExternal = () => {},
      name: nameInput = '',
    } = this.props;
    onChangeExternal(e.target.value, nameInput);
  }

  @autobind
  handleSelect(range) {
    const {
      onChangeCb: onChangeExternal = () => {},
      name: nameInput = '',
    } = this.props;

    const startDateStr = range.startDate.format('DD.MM.YY');
    const endDateStr = range.endDate.format('DD.MM.YY');
    let strDate = '';

    if (startDateStr === endDateStr) strDate = startDateStr;
    else strDate = `${startDateStr} - ${endDateStr}`;

    if (this.state.countSelects === 0) {
      this.setState(
        {
          value: strDate,
          countSelects: 1,
        },
        () => {
          onChangeExternal(strDate, nameInput);
        },
      );
    } else {
      this.setState(
        {
          value: strDate,
          countSelects: 0,
        },
        () => {
          onChangeExternal(strDate, nameInput);
          this.inputResult.blur();
        },
      );
    }
  }

  onMouseDownDatePopup = (e) => {
    e.preventDefault();
  }

  @autobind
  renderField() {
    const {
      type = 'text',
      className: classMod = '',
      id: idInput = '0',
      attr = {},
      placeholder = '',
      value = '',
    } = this.props;

    let startDate = moment();
    let endDate = moment();

    const startDateStr = value.match(/^(\d\d\.\d\d\.)(\d{2,4})/);
    const endDateStr = value.match(/-\s{1,}?(\d{2}\.\d{2}\.)(\d{2,4})/);

    if (startDateStr) {
      if (startDateStr[2].length === 2) {
        startDate = `${startDateStr[1]}20${startDateStr[2]}`;
      } else {
        startDate = startDateStr[0];
      }
    }
    if (endDateStr) {
      if (endDateStr[2].length === 2) {
        endDate = `${endDateStr[1]}20${endDateStr[2]}`;
      } else {
        endDate = endDateStr[0];
      }
    } else {
      endDate = startDate;
    }

    return (
      <div className={`input__field-wrap ${classMod}`}>
        <input
          type={type}
          ref={(c) => { this.inputResult = c; }}
          className="input__field input__field_icon"
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          value={this.props.value}
          placeholder={placeholder}
          id={idInput}
          {...attr}
        />
        <Icon icon="calendar" className="input__icon" />
        <div
          className={`input__popup-date-range ${this.state.isOpen ? 'state-open' : ''}`}
          onMouseDown={this.onMouseDownDatePopup}
          role="button"
          tabIndex={0}
        >
          <DateRange
            onChange={this.handleSelect}
            calendars="1"
            theme={this.state.theme}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>
    );
  }
}
