import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import Popup from '../../components/Popup/Popup';
import { lang } from '../../assets/js/lang';
import * as RegisterActions from '../../actions/RegisterActions';
import * as AppActions from '../../actions/AppActions';

import Button from '../../components/Button/Button';
import Quiz from '../../components/Quiz/Quiz';

import { endingWords } from '../../assets/js/helpers';
import './page-quiz.css';

class PageQuiz extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.function,
    }),
    actions: PropTypes.shape({
      registerQuizReseiveQuestions: PropTypes.func,
      registerQuizUpdateUserAnswers: PropTypes.func,
      registerQuizSendForm: PropTypes.func,
      userUpdate: PropTypes.func,
      userGetProfile: PropTypes.func,
    }),
    user: PropTypes.shape({
      id: PropTypes.number,
      is_test_passed: PropTypes.bool,
    }),
    isUserInit: PropTypes.bool,
    questions: PropTypes.arrayOf(
      PropTypes.object,
    ),
    isSuccess: PropTypes.bool,
    userAnswers: PropTypes.shape({}),
    isCompleted: PropTypes.bool,
    answers: PropTypes.shape({}),
  }

  static defaultProps = {
    history: {},
    actions: {
      registerQuizReseiveQuestions: () => {},
      registerQuizUpdateUserAnswers: () => {},
      userUpdate: () => {},
      registerQuizSendForm: () => {},
      userGetProfile: () => {},
    },
    user: {},
    isUserInit: false,
    questions: [],
    isSuccess: false,
    userAnswers: {},
    isCompleted: false,
    answers: {},
  }

  componentWillMount() {
    if (this.props.user.is_test_passed) {
      this.props.history.push('/');
    }

    if (this.props.questions.length === 0) {
      this.props.actions.registerQuizReseiveQuestions();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.user.is_test_passed) {
      nextProps.history.push('/');
    }
  }

  @autobind
  handleOnChangeQuiz(answers) {
    this.props.actions.registerQuizUpdateUserAnswers(answers);
  }

  @autobind
  handleOnClickRepeat() {
    this.props.actions.registerQuizReseiveQuestions();
  }

  @autobind
  handleOnSubmit() {
    const exportAnswers = [];
    const {
      userAnswers = {},
    } = this.props;

    Object.keys(userAnswers).forEach((key) => {
      const item = userAnswers[key];
      const newItem = {
        question: key,
        answers: item,
      };
      exportAnswers.push(newItem);
    });

    this.props.actions.registerQuizSendForm(exportAnswers);
  }

  @autobind
  handleMoveToMain() {
    this.props.actions.userGetProfile();
    this.props.history.push('/');
  }

  render() {
    const {
      questions = [],
      answers = {},
      userAnswers = {},
      isCompleted = false,
      isSuccess = false,
    } = this.props;

    // если мы не авторизованы
    // редиректим на главную, там есть форма авторизации,
    // а тут незареганому нечего делать
    if (!this.props.user.id && this.props.isUserInit) {
      this.props.actions.userGetProfile();
      this.props.history.push('/');
    }

    if (!this.props.isUserInit) {
      return null;
    }

    let isFull = false;
    if (Object.keys(userAnswers).length === questions.length) {
      isFull = true;
    }

    const {
      all_answers_count: countAll = null,
      right_answers_count: countRight = null,
    } = answers.summary;

    let errorStr = 'Вы не ответили ни на один вопрос верно.';
    if (countRight > 0) {
      errorStr = `Вы ответили верно на ${countRight} ${endingWords(['вопрос', 'вопроса', 'вопросов'], countRight)} из ${countAll}.`;
    }

    return (
      <div className="page-quiz">

        <section className="section">
          {isSuccess && (
            <Popup
              icon="funny"
              title={lang('forms', 'verifyTestTitle')}
              description={lang('forms', 'verifyTestDescription')}
              closeCallback={this.handleMoveToMain}
              className="popup_center popup_type_reset"
            >
              <Button className="page-restore__submit" text={lang('forms', 'resetMoveToMain')} onClick={this.handleMoveToMain} />
            </Popup>
          )}

          {!isSuccess && (
            <div className="container">
              <h1 className="page-quiz__page-title">Пройдите тест</h1>
              <div className="page-quiz__title-desc">Поздравляем! Вы зарегистрированы на нашем сайте. Осталось пройти тест для подтверждения вашей квалификации.</div>

              <div className="page-quiz__items">
                {questions.map((item, ind) => (
                  <Quiz
                    questionId={item.id}
                    title={item.title}
                    count={ind + 1}
                    cases={item.possible_answers}
                    answers={answers}
                    userAnswers={userAnswers}
                    visibleAnswers={isCompleted}
                    onChange={this.handleOnChangeQuiz}
                    key={item.id}
                  />
                ))}
              </div>

              {countAll !== null &&
                countRight !== null &&
                countAll !== countRight && (
                  <div className="page-quiz__error">
                    {errorStr} Для завершения регистрации попробуйте{' '}
                    <span
                      className="page-quiz__error-link"
                      onClick={this.handleOnClickRepeat}
                      role="button"
                      tabIndex="0"
                    >
                      пройти тест снова
                    </span>
                  </div>
                )}
              {!isCompleted && (
                <div className="page-quiz__submit">
                  <Button
                    text="Отправить"
                    disabled={!isFull}
                    onClick={this.handleOnSubmit}
                  />
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    questions: state.registerQuiz.questions,
    answers: state.registerQuiz.answers,
    userAnswers: state.registerQuiz.userAnswers,
    isCompleted: state.registerQuiz.isCompleted,
    isSuccess: state.registerQuiz.isSuccess,
    user: state.app.user,
    isUserInit: state.app.isUserInit,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...RegisterActions, ...AppActions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageQuiz);
