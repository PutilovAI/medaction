import React from 'react';
import { autobind } from 'core-decorators';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import Input from './Input';
import 'react-datepicker/dist/react-datepicker.css';
import './input.css';
import Icon from '../Icon/Icon';

export default class InputDateRange extends Input {
  state = {
    inputState: '',
    valueStart: '',
    valueEnd: '',
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
  handleSelectStart(date) {
    const {
      onChangeCb: onChangeExternal = () => {},
    } = this.props;
    onChangeExternal(date.format('YYYY-MM-DD'), 'dateStart');
  }

  @autobind
  handleSelectEnd(date) {
    const {
      onChangeCb: onChangeExternal = () => {},
    } = this.props;
    onChangeExternal(date.format('YYYY-MM-DD'), 'dateEnd');
  }

  onMouseDownDatePopup = (e) => {
    e.preventDefault();
  }

  @autobind
  renderField() {
    const {
      className: classMod = '',
      valueStart = '',
      valueEnd = '',
    } = this.props;

    const startDate = valueStart && moment(valueStart, 'YYYY-MM-DD');
    const endDate = valueEnd && moment(valueEnd, 'YYYY-MM-DD');

    return (
      <div className={`input__field-wrap ${classMod}`}>
        <div className="input__field-wrap_datepicker">
          <Icon icon="calendar" className="input__icon" />
          <DatePicker
            onChange={this.handleSelectStart}
            dateFormat="DD.MM.YYYY"
            selectsStart
            selected={startDate}
            startDate={startDate}
            endDate={endDate}
            className="input__field input__field_icon"
            showMonthDropdown
            showYearDropdown
            peekNextMonth
            todayButton="Сегодня"
            placeholderText="Дата от"
          />
        </div>
        <div className="input__field-wrap_datepicker">
          <Icon icon="calendar" className="input__icon" />
          <DatePicker
            onChange={this.handleSelectEnd}
            dateFormat="DD.MM.YYYY"
            selectsEnd
            selected={endDate}
            startDate={startDate}
            endDate={endDate}
            className="input__field input__field_icon"
            showMonthDropdown
            showYearDropdown
            peekNextMonth
            todayButton="Сегодня"
            placeholderText="Дата до"
          />
        </div>
      </div>
    );
  }
}
