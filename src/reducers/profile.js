import * as C from '../constants/profile';

const initialState = {
  profileUser: false,
  profileUserError: false,
  resetLoading: false,

  summary: false,
  summaryError: false,
  summaryLoading: false,
};

export default function app(state = initialState, action) {
  switch (action.type) {
    case C.PROFILE_RESET_ALL:
      return {
        ...state,
        summary: false,
        profileUser: false,
        profileUserError: false,
      };
    case C.GET_SUMMARY_LOADING:
      return {
        ...state,
        summaryLoading: true,
      };
    case C.GET_SUMMARY_FAIL:
      return {
        ...state,
        summary: false,
        summaryError: action.payload.error,
        summaryLoading: false,
      };
    case C.GET_SUMMARY_SUCCESS:
      return {
        ...state,
        summary: action.payload,
        summaryError: false,
        summaryLoading: false,
      };
    case C.PROFILE_USER_UPDATE:
      return {
        ...state,
        profileUser: action.payload,
        profileUserErrorStatus: false,
        profileUserError: false,
      };
    case C.PROFILE_USER_ERROR:
      return {
        ...state,
        profileUser: false,
        profileUserError: action.payload.error,
        profileUserErrorStatus: action.payload.status,
      };

    case C.PROFILE_RESET_PASSWORD_START:
      return {
        ...state,
        resetPasswordLoading: true,
      };

    case C.PROFILE_RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        resetPasswordSuccess: true,
        resetPasswordLoading: false,
        resetPasswordError: false,
      };

    case C.PROFILE_RESET_PASSWORD_ERROR:
      return {
        ...state,
        resetPasswordSuccess: false,
        resetPasswordLoading: false,
        resetPasswordError: true,
      };

    case C.PROFILE_RESET_PASSWORD_CANCEL:
      return {
        ...state,
        resetPasswordSuccess: false,
        resetPasswordLoading: false,
        resetPasswordError: false,
      };

    default:
      return state;
  }
}
