import React, { Component } from 'react';
import ReactSelect from 'react-select';
import PropTypes from 'prop-types';

import { lang } from '../../assets/js/lang';
import './react-select.css';
import './select.css';


export default class Select extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValue: null,
    };

    this.handelOnChange = this.onChange.bind(this);
  }

  onChange(newValue) {
    this.setState({
      selectValue: newValue,
    });
    this.props.onChange(newValue, this.props.name);
  }

  render() {
    const {
      options = [],
      label = '',
      noResultsText,
      placeholder,
      onChange,
      error,
      ...rest
    } = this.props;

    const errorList = Array.isArray(error) ? error : error || null;

    return (
      <div className="select">
        { label && <div className="select__label">{label}</div> }
        <ReactSelect
          ref={(c) => { this.reactSelect = c; }}
          options={options}
          onChange={this.handelOnChange}
          value={this.state.selectValue}
          placeholder={placeholder}
          noResultsText={noResultsText}
          className={error ? 'state-error' : ''}
          {...rest}
        />
        {errorList && errorList.map((errorItem, ind) => (
          <div className="input__error" key={`${ind + Math.random()}`}>{errorItem}</div>
        ))}
      </div>
    );
  }
}

Select.propTypes = {
  onChange: PropTypes.func,
  name: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.object,
  ),
  label: PropTypes.string,
  placeholder: PropTypes.string,
  noResultsText: PropTypes.string,
  error: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.shape({}),
    PropTypes.string,
    PropTypes.array,
  ]),
};

Select.defaultProps = {
  onChange: () => {},
  name: '',
  options: {},
  label: '',
  placeholder: lang('select', 'not_important'),
  noResultsText: lang('select', 'not_found'),
  error: null,
};
