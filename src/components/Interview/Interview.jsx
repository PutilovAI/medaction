import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { lang } from '../../assets/js/lang';
import './interview.css';

export default class Interview extends Component {
  @autobind
  handlerOnChoose(e) {
    if (this.props.onSubmit) {
      this.props.onSubmit({
        question: this.props.id,
        answers: [e.target.getAttribute('data-id')],
      });
    }
  }

  render() {
    let elAnswers = null;
    const isChecked = !!this.props.results;

    if (isChecked) {
      elAnswers = this.props.results.map((answer, index) => {
        let myAnswer = '';
        if (answer.my_own) {
          myAnswer = 'state-checked_my';
        }

        return (<div className={`interview__answer state-checked ${myAnswer}`} key={answer.id}>
          <div className="interview__answer-progress-line" style={{ width: `${answer.percentage}%` }} />
          <div className="interview__answer-row">
            <div className="interview__answer-text">{this.props.answers[index].title}</div>
            <div className="interview__answer-percent">{answer.percentage}%</div>
          </div>
        </div>);
      });
    } else if (this.props.answers && this.props.answers.length) {
      elAnswers = this.props.answers.map(answer => (
        <div className="interview__answer" onClick={this.handlerOnChoose} role="button" data-id={answer.id} tabIndex="-1" key={answer.id}>
          {answer.title}
        </div>
      ));
    }

    return (
      <div className={`interview ${this.props.className ? this.props.className : ''} ${isChecked ? 'state-checked' : ''}`}>
        <div className="interview__title">{lang('interview', 'questions')}</div>
        <div className="interview__question">{this.props.question}</div>

        <div className="interview__answers">
          {elAnswers}
        </div>
      </div>
    );
  }
}

Interview.propTypes = {
  className: PropTypes.string,
  question: PropTypes.string,
  answers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    percentage: PropTypes.number,
  })),
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  // results - Будет приходить другая структура. Спросить Женю по готовности
  results: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    percentage: PropTypes.number,
  })),
  onSubmit: PropTypes.func,
};
Interview.defaultProps = {
  className: '',
  id: 0,
  question: '',
  answers: [],
  results: [],
  onSubmit: () => {},
};
