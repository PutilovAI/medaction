import { showLoading, hideLoading } from 'react-redux-loading-bar';
import * as C from '../constants/email';
import { customFetch } from '../assets/js/helpers';

export function verifyEmailCancel() {
  return (dispatch) => {
    dispatch({
      type: C.VERIFY_EMAIL_CANCEL,
    });
  };
}

export function verifyEmail(formBody) {
  return (dispatch) => {
    dispatch(showLoading());
    dispatch({
      type: C.VERIFY_EMAIL_START,
    });

    customFetch(
      `${C.URL_VERIFY_EMAIL}`,
      'POST',
      { body: JSON.stringify(formBody) },
      {
        success: (result) => {
          dispatch({
            type: C.VERIFY_EMAIL_SUCCESS,
            payload: result,
          });
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.VERIFY_EMAIL_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch({
            type: C.VERIFY_EMAIL_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function reSendEmailCancel() {
  return (dispatch) => {
    dispatch({
      type: C.RESEND_EMAIL_CANCEL,
    });
  };
}

export function reSendEmail(formBody) {
  return (dispatch) => {
    dispatch(showLoading());
    dispatch({
      type: C.RESEND_EMAIL_START,
    });

    if (!formBody.next) {
      formBody.next = '/auth/email/verify';
    }

    customFetch(
      `${C.URL_RESEND_EMAIL}`,
      'POST',
      { body: JSON.stringify(formBody) },
      {
        success: (result) => {
          dispatch({
            type: C.RESEND_EMAIL_SUCCESS,
            payload: result,
          });
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.RESEND_EMAIL_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch({
            type: C.RESEND_EMAIL_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function clearRemind() {
  return (dispatch) => {
    dispatch({
      type: C.REMIND_CANCEL,
    });
  };
}

export function sendRemind(formBody) {
  return (dispatch) => {
    dispatch(showLoading());
    dispatch({
      type: C.REMIND_START,
    });

    if (!formBody.next) {
      formBody.next = '/auth/password/reset';
    }

    customFetch(
      C.URL_API_REMIND,
      'POST',
      { body: JSON.stringify(formBody) },
      {
        success: () => {
          dispatch({
            type: C.REMIND_SUCCESS,
          });
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.REMIND_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch({
            type: C.REMIND_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}
