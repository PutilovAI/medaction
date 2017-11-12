import React, { Component } from 'react';
import ReactSelect from 'react-select';
import PropTypes from 'prop-types';

import { lang } from '../../assets/js/lang';
import './react-select.css';
import './select.css';

export default class SelectAutocomplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValue: null,
    };

    this.handleOnChange = this.onChange.bind(this);
  }

  onChange(newValue) {
    this.setState({
      selectValue: newValue,
    });

    this.props.onChange(newValue, this.props.name);
  }

  render() {
    const {
      options,
      label,
      noResultsText,
      placeholder,
      onChange,
      value = this.state.selectValue,
      multi,
      ...rest
    } = this.props;

    return (
      <div className="select">
        { label && <div className="select__label">{label}</div> }
        <ReactSelect
          ref={(c) => { this.reactSelect = c; }}
          options={options}
          value={value}
          placeholder={placeholder}
          noResultsText={noResultsText}
          multi={multi}
          onChange={this.handleOnChange}
          {...rest}
        />
      </div>
    );
  }
}

SelectAutocomplete.propTypes = {
  onChange: PropTypes.func,
  name: PropTypes.string,
  options: PropTypes.shape({}),
  label: PropTypes.string,
  placeholder: PropTypes.string,
  noResultsText: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.oneOf([null]),
  ]),
  multi: PropTypes.bool,
};

SelectAutocomplete.defaultProps = {
  onChange: () => {},
  name: '',
  options: {},
  label: '',
  placeholder: lang('select', 'not_important'),
  noResultsText: lang('select', 'not_found'),
  value: null,
  multi: false,
};
