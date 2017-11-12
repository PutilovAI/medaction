import React from 'react';
import './input.css';
import Checkbox from './Checkbox';

export default class Radio extends Checkbox {
  render() {
    const checked = this.state.checked;
    const {
      className: classMod = '',
      id: idInput = '0',
      name = '',
      label,
      value,
      attr = {},
    } = this.props;

    return (
      <div className={`input input_radio ${classMod} ${checked ? 'checked' : ''}`}>
        <label className="input__label" htmlFor={idInput}>
          <input
            type="radio"
            className="input__radio"
            onChange={this.handlerOnChange}
            checked={checked}
            id={idInput}
            name={name}
            value={value}
            {...attr}
          />
          <div className="input__label-text">
            {label}
          </div>
        </label>
      </div>
    );
  }
}
