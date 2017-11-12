import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './article-form.css';

export default class AuthorSelectOption extends Component {
  constructor(props) {
    super(props);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  handleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.onSelect(this.props.option, event);
  }
  handleMouseEnter(event) {
    this.props.onFocus(this.props.option, event);
  }
  handleMouseMove(event) {
    if (this.props.isFocused) return;
    this.props.onFocus(this.props.option, event);
  }
  render() {

    const styleImgWrap = {
      width: '25px',
      maxHeight: '25px',
      display: 'inline-block',
      marginRight: '15px',
      overflow: 'hidden',
      verticalAlign: 'middle',
      borderRadius: '5px',
    };

    const styleImg = {
      display: 'block',
      width: '100%',
    };

    let avatar = '';
    if (this.props.option && this.props.option.avatar) {
      avatar = `${API_URL}${this.props.option.avatar}`;
    }

    return (
      <div
        className={this.props.className}
        onMouseDown={this.handleMouseDown}
        onMouseEnter={this.handleMouseEnter}
        onMouseMove={this.handleMouseMove}
        title={this.props.option.title}
        role={'button'}
        tabIndex={0}
      >
        {avatar &&
          (<div style={styleImgWrap}>
            <img alt="" src={avatar} style={styleImg} />
          </div>)
        }

        { `${this.props.option.last_name} ${this.props.option.first_name}` }
      </div>
    );
  }
}

AuthorSelectOption.propTypes = {
  onSelect: PropTypes.func,
  onFocus: PropTypes.func,
  option: PropTypes.shape({
    photo: PropTypes.string,
    title: PropTypes.string,
  }),
  isFocused: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
};

AuthorSelectOption.defaultProps = {
  onSelect: () => {},
  onFocus: () => {},
  option: {
    photo: '',
    title: '',
  },
  isFocused: false,
  className: '',
  children: null,
};
