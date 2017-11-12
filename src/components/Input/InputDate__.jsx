import React from 'react';
import { autobind } from 'core-decorators';
import { Calendar } from 'react-date-range';

import Input from './Input';
import './input.css';
import Icon from '../Icon/Icon';


export default class InputDate extends Input {
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
  handleSelect(newDate) {
    const {
      onChangeCb: onChangeExternal = () => {},
      name: nameInput = '',
    } = this.props;

    const data = newDate.format('DD.MM.YYYY');

    this.setState(
      {
        value: data,
      },
      () => {
        onChangeExternal(data, nameInput);
        this.inputResult.blur();
      },
    );
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


    let dateStr = value.match(/^(\d\d\.\d\d\.)(\d{2,4})/);

    if (dateStr) {
      if (dateStr[2].length === 2) {
        dateStr = `${dateStr[1]}20${dateStr[2]}`;
      } else {
        dateStr = dateStr[0];
      }
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
          role="button"
          tabIndex={0}
          className={`input__popup-date-range ${this.state.isOpen ? 'state-open' : ''}`}
          onMouseDown={this.onMouseDownDatePopup}
        >
          <Calendar
            onChange={this.handleSelect}
            theme={this.state.theme}
            date={dateStr}
          />
        </div>
      </div>
    );
  }
}
