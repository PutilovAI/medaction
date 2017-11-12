import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { customFetch } from '../assets/js/helpers';
import * as C from '../constants/invite';

export function resetInviteFunction() {
  return (dispatch) => {
    dispatch({
      type: C.INVITE_SEND_RESET,
    });
  };
}

export function sendInvite(data) {
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      C.URL_INVITE_SEND,
      'POST',
      { body: JSON.stringify(data) },
      {
        success: (result) => {
          dispatch({
            type: C.INVITE_SEND_SUCCESS,
            payload: result.detail,
          });
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.INVITE_SEND_FAIL,
            payload: error.error.detail,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch({
            type: C.INVITE_SEND_FAIL,
            payload: error.error.detail,
          });
          dispatch(hideLoading());
        },
      },
    );
    setTimeout(() => {
      dispatch(resetInviteFunction());
    }, 10000);
  };
}
