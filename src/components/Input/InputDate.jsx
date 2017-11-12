import React from 'react';
import { autobind } from 'core-decorators';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import Input from './Input';
import './input.css';
import Icon from '../Icon/Icon';

import 'react-datepicker/dist/react-datepicker.css';
import './inputDate.css';


export default class InputDate extends Input {
  state = {
    inputState: '',
    value: '',
    countSelects: 0,
    isOpen: false,
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

    const data = newDate.format('YYYY.MM.DD');

    this.setState(
      {
        value: data,
      },
      () => {
        onChangeExternal(data, nameInput);
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

    let currentDate;

    if (value) {
      currentDate = moment(value, 'YYYY-MM-DD');
    }

    return (
      <div className={`input__field-wrap ${classMod}`}>
        <DatePicker
          onChange={this.handleSelect}
          dateFormat="DD.MM.YYYY"
          selected={currentDate || moment()}
          className="input__field input__field_icon"
          showMonthDropdown
          showYearDropdown
          peekNextMonth
        />
        <Icon icon="calendar" className="input__icon" />
      </div>
    );
  }
}
