import React from 'react';
import { autobind } from 'core-decorators';
import Icon from '../Icon/Icon';

import Input from './Input';

import './input.css';

export default class InputPasswordSwitch extends Input {
  state = {
    inputState: '',
    value: '',
    visible: false,
  };

  @autobind
  onClickPasswordVisibleButton() {
    this.setState(prevState => ({
      visible: !prevState.visible,
    }));
  }
  renderField() {
    const {
      className: classMod = '',
      id: idInput = '0',
      attr = {},
      placeholder = '',
    } = this.props;
    const {
      value,
      visible,
    } = this.state;

    return (
      <div className="input__password-wrap">
        {!visible && (
          <input
            type="password"
            className={`input__field input__field_password ${classMod}`}
            onChange={this.onChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            value={value}
            placeholder={placeholder}
            id={idInput}
            {...attr}
          />)
        }

        {visible && (
          <input
            type="text"
            className={`input__field input__field_password ${classMod}`}
            onChange={this.onChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            value={value}
            placeholder={placeholder}
            id={idInput}
            {...attr}
          />)
        }

        <div className="input__password-visible-button" onClick={this.onClickPasswordVisibleButton} role="button" tabIndex="0">
          <Icon icon={`${!visible ? 'eye_close' : 'eye_open'}`} />
        </div>
      </div>
    );
  }
}
