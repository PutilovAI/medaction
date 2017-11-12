import * as C from '../constants/app';

const initialState = {
  questions: [],
  answers: {
    questions: {},
    summary: {},
  },
  userAnswers: {},
  isCompleted: false,
  isSuccess: false,
};

export default function registerQuiz(state = initialState, action) {
  switch (action.type) {
    case C.REGISTER_QUIZ_UPDATE_USER_ANSWERS:
      return {
        ...state,
        userAnswers: action.payload,
      };
    case C.REGISTER_QUIZ_UPDATE_QUESTIONS:
      return {
        ...state,
        questions: action.payload,
        answers: {
          questions: {},
          summary: {},
        },
        userAnswers: {},
        isCompleted: false,
      };
    case C.REGISTER_QUIZ_SEND_COMPLETE:
      return {
        ...state,
        answers: action.payload,
        isCompleted: true,
      };
    case C.REGISTER_QUIZ_SUCCESS:
      return {
        ...state,
        isSuccess: true,
      };
    default:
      return state;
  }
}
