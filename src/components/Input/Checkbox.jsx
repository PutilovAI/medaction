import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';

import './input.css';

export default class Checkbox extends Component {
  static propTypes = {
    defaultChecked: PropTypes.bool,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    className: PropTypes.string,
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    label: PropTypes.string,
  }

  static defaultProps = {
    defaultChecked: false,
    checked: false,
    onChange: () => {},
    className: '',
    id: 0,
    label: '',
  }

  state = {
    checked: this.props.defaultChecked || this.props.checked || false,
  };

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.checked !== 'undefined') {
      this.setState({
        checked: nextProps.checked,
      });
    }
  }

  @autobind
  handlerOnChange(event) {
    event.persist();

    this.setState(
      {
        checked: !this.state.checked,
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(event);
        }
      },
    );
  }

  render() {
    const checked = this.state.checked || this.props.defaultChecked;

    const {
      className: classMod = '',
      id: idInput = '0',
      label,
    } = this.props;

    return (
      <div className={`input input_checkbox ${classMod} ${checked ? 'checked' : ''}`}>
        <input
          type="checkbox"
          className="input__checkbox"
          onChange={this.handlerOnChange}
          key={this.props.defaultChecked ? 'notLoadedYet' : 'loaded'}
          defaultChecked={this.props.defaultChecked}
          id={this.props.id}
        />
        <label htmlFor={idInput} className="input__label">
          { this.props.children ? this.props.children : <span className="input__label-text" dangerouslySetInnerHTML={{ __html: label }} /> }
        </label>
      </div>
    );
  }
}
