import React, { Component } from 'react';
import ReactSelect from 'react-select';
import PropTypes from 'prop-types';

import { lang } from '../../assets/js/lang';
import './react-select.css';
import './select.css';


export default class SelectAutocompleteAsync extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };

    this.handleOnChange = this.onChange.bind(this);
    this.handleLoadOptions = this.loadOptions.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {
      value,
      loadOptions,
    } = nextProps;

    if (value !== this.state.value) {
      this.setState({
        value,
      });
    }

    if (loadOptions) {
      this.loadOptions = loadOptions;
    }
  }

  onChange(newValue) {
    this.setState({
      value: newValue,
    }, () => {
      if (this.props.onChange) {
        this.props.onChange(newValue, this.props.name);
      }
    });
  }

  loadOptions(input) {
    const {
      url,
    } = this.props;

    return fetch(`${API_URL}${url}?${this.props.getParam || 'name'}=${decodeURIComponent(input)}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Forwarded-Host': `${THEME.host}`,
      },
      credentials: 'include',
    }).then(response => response.json())
      .then(options => ({
        options: options.results,
        complete: true,
      }));
  }

  render() {
    const {
      options,
      label,
      noResultsText,
      placeholder,
      onChange,
      creatable,
      value = this.state.value,
      loadOptions,
      url,
      ...rest
    } = this.props;

    let elementSelect = (
      <ReactSelect.Async
        value={value}
        placeholder={placeholder}
        onChange={this.handleOnChange}
        noResultsText={noResultsText}
        loadOptions={this.handleLoadOptions}
        {...rest}
      />
    );

    if (creatable) {
      elementSelect = (
        <ReactSelect.AsyncCreatable
          value={value}
          placeholder={placeholder}
          onChange={this.handleOnChange}
          noResultsText={noResultsText}
          loadOptions={this.handleLoadOptions}
          {...rest}
        />
      );
    }

    return (
      <div className="select">
        { label && <div className="select__label">{label}</div> }
        {elementSelect}
      </div>
    );
  }
}

SelectAutocompleteAsync.propTypes = {
  onChange: PropTypes.func,
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  noResultsText: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
    PropTypes.oneOf([null]),
  ]),
  multi: PropTypes.bool,
  creatable: PropTypes.bool,
  loadOptions: PropTypes.func,
  url: PropTypes.string,
  getParam: PropTypes.string,
  error: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.shape({}),
    PropTypes.string,
    PropTypes.array,
  ]),
};

SelectAutocompleteAsync.defaultProps = {
  onChange: () => {},
  name: '',
  label: '',
  placeholder: lang('select', 'not_important'),
  noResultsText: lang('select', 'not_found'),
  value: null,
  multi: false,
  creatable: false,
  loadOptions: () => {},
  url: '',
  getParam: '',
  error: null,
};
