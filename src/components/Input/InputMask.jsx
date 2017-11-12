import React from 'react';
import ReactInputMask from 'react-input-mask';
import Input from './Input';

import './input.css';

export default class InputMask extends Input {
  renderField() {
    const {
      type = 'text',
      className: classMod = '',
      id: idInput = '0',
      attr = {},
      placeholder = '',
      mask = '',
      maskChar = '_',
    } = this.props;
    const { value } = this.state;

    return (
      <ReactInputMask
        mask={mask}
        maskChar={maskChar}
        type={type}
        className={`input__field ${classMod}`}
        onChange={this.onChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        value={value}
        placeholder={placeholder}
        id={idInput}
        {...attr}
      />
    );
  }
}
