import * as C from '../constants/news';

const initialState = {

};

export default function consilium(state = initialState, action) {
  switch (action.type) {
    case C.NEWS_HARD_RESET:
      return {
        ...state,
        newsLoading: false,
        news: {
          count: -1,
          results: [],
        },
        newsMessage: '',
        newsFailureStatus: null,
        currentNews: {
        },
      };
    case C.NEWS_START:
      return {
        ...state,
        newsLoading: true,
      };
    case C.NEWS_SUCCESS:
      return {
        ...state,
        news: action.payload,
        newsLoading: false,
      };
    case C.NEWS_FAILURE:
      return {
        ...state,
        newsmMessage: action.payload.error,
        newsFailureStatus: action.payload.status,
        newsLoading: false,
      };
    case C.NEWS_CANCEL:
      return {
        ...state,
        newsMessage: '',
        newsLoading: false,
        newsFailureStatus: null,
      };
    case C.NEWS_QUESTION_SUCCESS:
      return {
        ...state,
        newsAskQuestionSuccess: true,
        newsMessage: action.message,
      };
    case C.CURRENT_NEWS_SUCCESS:
      return {
        ...state,
        currentNews: action.payload,
      };

    default:
      return state;
  }
}
