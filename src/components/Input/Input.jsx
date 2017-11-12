import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import './input.css';

export default class Input extends Component {
  static propTypes = {
    newValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]),
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]),
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    type: PropTypes.string,
    className: PropTypes.string,
    id: PropTypes.string,
    attr: PropTypes.oneOfType([
      PropTypes.shape({}),
      PropTypes.string,
    ]),
    placeholder: PropTypes.string,
    label: PropTypes.string,
    error: PropTypes.oneOfType([
      PropTypes.oneOf([null]),
      PropTypes.shape({}),
      PropTypes.string,
      PropTypes.array,
    ]),
  }

  static defaultProps = {
    newValue: '',
    value: '',
    onChange: () => {},
    onFocus: () => {},
    onBlur: () => {},
    type: '',
    className: '',
    id: '',
    attr: '',
    placeholder: '',
    label: '',
    error: null,
  }

  constructor(props) {
    super(props);

    this.state = {
      inputState: '',
      value: this.props.newValue || '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
    });
  }

  @autobind
  onFocusCb(e) {}

  @autobind
  onBlurCb(e) {}

  @autobind
  onChangeCb(e) {}

  @autobind
  onChange(e) {
    e.persist();
    this.setState({
      value: e.target.value,
    });

    if (this.props.onChange) {
      this.props.onChange(e);
    }

    this.onChangeCb(e);
  }

  @autobind
  onFocus(e) {
    e.persist();
    this.setState(
      {
        inputState: ' focus',
      },
      (...args) => {
        if (this.props.onFocus) {
          this.props.onFocus.apply(this, Array.from(args));
        }
        this.onFocusCb(e);
      },
    );
  }

  @autobind
  onBlur(e) {
    e.persist();
    this.setState(
      {
        inputState: '',
      },
      (...args) => {
        if (this.props.onBlur) {
          this.props.onBlur.apply(this, Array.from(args));
        }
        this.onBlurCb(e);
      },
    );
  }

  @autobind
  renderField() {
    const {
      type = 'text',
      id: idInput = '0',
      attr = {},
      placeholder = '',
    } = this.props;
    const { value } = this.state;

    if (this.props.beautyInput) {
      return (<input
        type={type}
        className="input__field"
        onChange={this.onChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        placeholder={placeholder}
        defaultValue={this.props.value}
        id={idInput}
        disabled={this.props.disabled ? 'disabled' : false}
        {...attr}
      />);
    }

    if (this.props.value) {
      return (<input
        autoComplete="off"
        type={type}
        className="input__field"
        onChange={this.onChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        placeholder={placeholder}
        value={this.props.value}
        id={idInput}
        disabled={this.props.disabled ? 'disabled' : false}
        {...attr}
      />);
    }

    return (<input
      type={type}
      autoComplete="off"
      className="input__field"
      onChange={this.onChange}
      onFocus={this.onFocus}
      onBlur={this.onBlur}
      placeholder={placeholder}
      id={idInput}
      disabled={this.props.disabled ? 'disabled' : false}
      {...attr}
    />);
  }

  render() {
    const {
      className: classMod = '',
      id: idInput = '0',
      label = null,
      error = null,
    } = this.props;

    const errorList = Array.isArray(error) ? error : error || null;

    return (
      <div className={`input input_text ${classMod} ${error ? 'state-error' : ''} ${this.state.inputState}`}>
        {label &&
          <label className="input__label" htmlFor={idInput}>
            <div className="input__label-text">
              {label}
            </div>
          </label>}

        {this.renderField()}

        {errorList && errorList.map((errorItem, ind) => (
          <div className="input__error" key={`${ind + Math.random()}`}>{errorItem}</div>
        ))}
      </div>
    );
  }
}
