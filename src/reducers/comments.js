import * as C from '../constants/comments';

const initialState = {
  commentsMessage: '',
};

export default function comments(state = initialState, action) {
  switch (action.type) {
    case C.COMMENTS_START:
      return {
        ...state,
        commentsLoading: true,
      };
    case C.COMMENTS_SUCCESS:
      return {
        ...state,
        comments: action.payload,
        commentsLoading: false,
      };
    case C.COMMENTS_FAILURE:
      return {
        ...state,
        commentsMessage: action.payload.error.detail,
        commentsLoading: false,
      };
    case C.COMMENTS_CANCEL:
      return {
        commentsMessage: '',
        commentsLoading: false,
      };

    case C.COMMENTS_POST_SUCCESS:
      return {
        ...state,
        commentsMessage: action.message,
        commentsLoading: false,
      };
    case C.COMMENTS_POST_FAILURE:
      return {
        ...state,
        commentsMessage: action.payload.error.detail,
        commentsLoading: false,
      };
    case C.COMMENT_NOTIFICATION_CANCEL:
      return {
        ...state,
        commentsMessage: '',
      };
    default:
      return state;
  }
}
