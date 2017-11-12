import { showLoading, hideLoading } from 'react-redux-loading-bar';
import * as C from '../constants/profile';
import { customFetch } from '../assets/js/helpers';

export function userProfileUpdate(user) {
  return {
    type: C.PROFILE_USER_UPDATE,
    payload: user,
  };
}

export function resetProfile() {
  return (dispatch) => {
    dispatch({
      type: C.PROFILE_RESET_ALL,
    });
  };
}

export function userProfileError(error) {
  return {
    type: C.PROFILE_USER_ERROR,
    payload: error,
  };
}

export function receiveProfileId(id) {
  return (dispatch) => {
    dispatch(showLoading());
    // если мы запрашивает что-то отличное от типа INT
    // сразу выплевываем 404 без запроса
    if (isNaN(id)) {
      dispatch(userProfileError({ errorStatus: 404, errorText: '' }));
      return;
    }

    customFetch(
      `${C.URL_API_PROFILE}${id}`,
      'GET',
      {},
      {
        success: (result) => {
          dispatch(userProfileUpdate(result));
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch(userProfileError(error));
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch(userProfileError(error));
          dispatch(hideLoading());
        },
      },
    );
  };
}
export function receiveProfile() {
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      `${C.URL_API_PROFILE}`,
      'GET',
      {},
      {
        success: (result) => {
          dispatch(userProfileUpdate(result));
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch(userProfileError(error));
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch(userProfileError(error));
          dispatch(hideLoading());
        },
      },
    );
  };
}
export function getSummary() {
  return (dispatch) => {
    dispatch(showLoading());
    dispatch({
      type: C.GET_SUMMARY_LOADING,
    });

    customFetch(
      `${C.URL_API_GET_SUMMARY}`,
      'GET',
      {},
      {
        success: (result) => {
          dispatch({
            type: C.GET_SUMMARY_SUCCESS,
            payload: result,
          });
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.GET_SUMMARY_FAIL,
            payload: error,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch({
            type: C.GET_SUMMARY_FAIL,
            payload: { error, status: 400 },
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function profileChangePhoto(newPhoto, cbSuccess) {
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      `${C.URL_API_PROFILE_PHOTO}`,
      'PUT',
      { body: newPhoto },
      {
        success: (result) => {
          cbSuccess(result.avatar);
          dispatch(hideLoading());
        },
        error: (error) => {
          console.log(error);
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function profileResetCancel() {
  return (dispatch) => {
    dispatch({
      type: C.PROFILE_RESET_PASSWORD_CANCEL,
    });
  };
}

export function profileResetPassword(formData) {
  return (dispatch) => {
    dispatch(showLoading());
    dispatch({
      type: C.PROFILE_RESET_PASSWORD_START,
    });
    customFetch(
      `${C.URL_PROFILE_RESET_PASSWORD}`,
      'POST',
      { body: JSON.stringify(formData) },
      {
        success: (result) => {
          dispatch({
            type: C.PROFILE_RESET_PASSWORD_SUCCESS,
            payload: result,
          });
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.PROFILE_RESET_PASSWORD_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch({
            type: C.PROFILE_RESET_PASSWORD_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}
