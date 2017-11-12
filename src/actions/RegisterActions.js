import { showLoading, hideLoading } from 'react-redux-loading-bar';
import * as C from '../constants/app';
import { customFetch } from '../assets/js/helpers';

export function updateFields(fields) {
  return {
    type: C.REGISTER_FORM_UPDATE_FIELDS,
    payload: fields,
  };
}
export function registerSendFormSuccess(message) {
  return {
    type: C.REGISTER_FORM_SEND_SUCCESS,
    payload: message,
  };
}
export function registerSendFormFailure(errors) {
  return {
    type: C.REGISTER_FORM_SEND_FAILURE,
    payload: errors,
  };
}

export function unBindSocial(social) {
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      `${C.URL_UNBIND_SOCIAL}?social=${social}`,
      'GET',
      {},
      {
        success: (result) => {
          dispatch({
            type: C.UNBIND_SOCIAL_SUCCESS,
            payload: result,
          });
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.UNBIND_SOCIAL_FAIL,
            payload: error,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch({
            type: C.UNBIND_SOCIAL_FAIL,
            payload: error,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function registerSendForm(formBody) {
  return (dispatch) => {
    dispatch(showLoading());
    if (!formBody.next) {
      formBody.next = '/auth/email/verify';
    }

    customFetch(
      C.URL_API_REGISTER,
      'POST',
      { body: JSON.stringify(formBody) },
      {
        success: (result) => {
          dispatch(registerSendFormSuccess(result));
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch(registerSendFormFailure(error));
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch(registerSendFormFailure(error));
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function editSendForm(formBody, callback) {
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      C.URL_API_PROFILE,
      'PATCH',
      { body: JSON.stringify(formBody) },
      {
        success: (result) => {
          dispatch({
            type: C.EDIT_PROFILE_SUCCESS,
            payload: result,
          });
          dispatch(hideLoading());
          callback && callback();
        },
        error: (error) => {
          dispatch({
            type: C.EDIT_PROFILE_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch({
            type: C.EDIT_PROFILE_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}


// Подтверждение регистрации
export function registerConfirmSendTokenSuccess(message) {
  return {
    type: C.REGISTER_CONFIRM_SEND_SUCCESS,
    payload: message,
  };
}
export function registerConfirmSendTokenFailure(errors) {
  return {
    type: C.REGISTER_CONFIRM_SEND_FAILURE,
    payload: errors,
  };
}
export function registerConfirmSendToken(formBody) {
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      C.URL_API_REGISTER_CONFIRM,
      'POST',
      { body: JSON.stringify(formBody) },
      {
        success: (result) => {
          dispatch(registerConfirmSendTokenSuccess(result));
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch(registerConfirmSendTokenFailure(error));
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch(registerConfirmSendTokenFailure(error));
          dispatch(hideLoading());
        },
      },
    );
  };
}

// Тесты для регистрации
export function registerQuizUpdateUserAnswers(answers) {
  return {
    type: C.REGISTER_QUIZ_UPDATE_USER_ANSWERS,
    payload: answers,
  };
}

export function registerQuizSendForm(formBody) {
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      C.URL_API_REGISTER_QUIZ_COMPLETE,
      'POST',
      { body: JSON.stringify(formBody) },
      {
        success: (result) => {
          dispatch({
            type: C.REGISTER_QUIZ_SEND_COMPLETE,
            payload: result,
          });
          dispatch({
            type: C.REGISTER_QUIZ_SUCCESS,
          });
          dispatch(hideLoading());
        },
        error: (result) => {
          dispatch({
            type: C.REGISTER_QUIZ_SEND_COMPLETE,
            payload: result.error,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}


export function registerQuizReseiveQuestions() {
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      C.URL_API_REGISTER_QUIZ_LIST,
      'GET',
      {},
      {
        success: (result) => {
          dispatch({
            type: C.REGISTER_QUIZ_UPDATE_QUESTIONS,
            payload: result,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function changePassword(formBody) {
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      C.URL_API_CHANGE_PASSWORD,
      'PUT',
      { body: formBody },
      {
        success: () => {
          dispatch({
            type: C.CHANGE_PASSWORD_COMPLETE,
          });
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.CHANGE_PASSWORD_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch({
            type: C.CHANGE_PASSWORD_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function cancelRegisterEdit() {
  return (dispatch) => {
    dispatch({
      type: C.REGISTER_CANCEL,
    });
  };
}
