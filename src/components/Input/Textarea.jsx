import React from 'react';
import { autobind } from 'core-decorators';
import './input.css';
import Input from './Input';

export default class Textarea extends Input {
  // span = () => {
  //   const span = document.createElement('span');
  //   span.className = 'double_textarea';
  //   span.style.display = 'inline-block';
  //   span.style.wordBreak = 'break-all';
  //   document.getElementById('root').appendChild(span);
  // }
  // componentDidMount() {
  //   if (this.props.multipleLines) {
  //     this.span();
  //   }
  // }
  // componentWillUnmount() {
  //   for (let i = 0; i < document.getElementsByClassName('double_textarea').length; i += 1) {
  //     const item = document.getElementsByClassName('double_textarea')[i];
  //     document.removeChild(item);
  //   }
  // }
  @autobind
  onInput(e) {
    this.doubleSpan.innerHTML = e.target.value;
    //  var text = $(this).val();
    //  span.text(text);
    //  $(this).height(text ? span.height() : '1.1em');
    e.target.style.height = this.doubleSpan.offsetHeight ? `${this.doubleSpan.offsetHeight}px` : '80px';
  }
  onKeyPress = (e) => {
    // cancel the Enter keystroke, otherwise a new line will be created
    // This ensures the correct behavior when user types Enter
    // into an input field
    if (e.which === 13) {
      // e.preventDefault();
    }
  }
  renderField() {
    const {
      inputClassName = '',
      id: idInput = '0',
      attr = {},
      placeholder = '',
    } = this.props;


    return (
      <div>
        <div className="input__double-textarea-wrap">
          <span className="input__double-textarea" ref={(d) => { this.doubleSpan = d; }} />
        </div>
        <textarea
          className={`input__textarea ${inputClassName}`}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onKeyPress={this.onKeyPress}
          onInput={this.onInput}
          id={idInput}
          defaultValue={this.props.value || ''}
          placeholder={placeholder}
          {...attr}
        />
      </div>
    );
  }
}
