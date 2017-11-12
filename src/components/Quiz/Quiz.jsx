import React, { Component } from 'react';
import dcopy from 'deep-copy';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import Icon from '../Icon/Icon';
import { Checkbox } from '../Input/InputComponents';
import './quiz.css';

export default class Quiz extends Component {
  static propTypes = {
    userAnswers: PropTypes.shape({}),
    onChange: PropTypes.func,
    className: PropTypes.string,
    questionId: PropTypes.number,
    title: PropTypes.string,
    count: PropTypes.number,
    cases: PropTypes.arrayOf(
      PropTypes.shape({}),
    ),
    answers: PropTypes.shape({}),
    visibleAnswers: PropTypes.bool,
  }

  static defaultProps = {
    userAnswers: {},
    onChange: () => {},
    className: '',
    questionId: -1,
    title: null,
    count: 0,
    cases: [],
    answers: {},
    visibleAnswers: false,
  }

  @autobind
  handleOnChangeRadio(e) {
    const target = e.target;
    const newUserAnswers = dcopy(this.props.userAnswers);

    const valueId = target.id.split('_');
    const id = valueId[1];
    const question = valueId[0];

    if (target.checked) {
      if (!newUserAnswers[question]) {
        newUserAnswers[question] = [id];
      } else {
        newUserAnswers[question].push(id);
      }
    } else if (newUserAnswers[question]) {
      const index = newUserAnswers[question].indexOf(id);

      if (index > -1) {
        newUserAnswers[question].splice(index, 1);
      }
    }
    this.props.onChange(newUserAnswers);
  }
  render() {
    const {
      className: classMod = '',
      questionId = null,
      title = null,
      count = 1,
      cases = [],
      answers = {},
      userAnswers = {},
      visibleAnswers = false,
    } = this.props;

    const curAnswer = answers.questions[questionId];
    let elCases = null;

    if (visibleAnswers) {
      elCases = cases.map((item) => {
        const {
          title: text = null,
          id: itemId,
        } = item;

        let status = null;
        let elStatus = null;
        let quizModColor = null;

        if (typeof curAnswer !== 'undefined') {
          if (curAnswer.right_answers.indexOf(parseInt(itemId)) !== -1) {
            status = true;
          } else if (curAnswer.invalid_user_answers.indexOf(parseInt(itemId)) !== -1) {
            status = false;
          }

          if (status !== null) {
            elStatus = (
              <div className="quiz__case-status">
                <Icon icon={status ? 'acept' : 'cancel'} />
              </div>
            );
            quizModColor = status ? 'state-success' : 'state-failure';
          }
        }
        return (
          <div className={`quiz__case ${quizModColor}`} key={item.id}>
            {elStatus}
            <div className="quiz__case-text">
              {text}
            </div>
          </div>
        );
      });
    } else {
      elCases = cases.map((item) => {
        let isChecked = false;
        const answer = userAnswers[item.question];

        if (typeof answer !== 'undefined') {
          if (Array.isArray(answer) && answer.indexOf(String(item.id)) !== -1) {
            isChecked = true;
          } else if (parseInt(answer, 10) === parseInt(isChecked, 10)) {
            isChecked = true;
          }
        }

        return (
          <Checkbox
            className="quiz__radio"
            label={item.title}
            checked={isChecked}
            onChange={this.handleOnChangeRadio}
            defaultChecked={false}
            key={item.id}
            id={`${item.question}_${item.id}`}
          />
        );
      });
    }

    return (
      <div className={`quiz ${classMod}`}>
        {title &&
          <div className="quiz__title">
            {`${count}. ${title}`}
          </div>}
        <div className="quiz__cases">
          {elCases}
        </div>
      </div>
    );
  }
}
