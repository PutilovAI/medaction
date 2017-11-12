import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { customFetch } from '../assets/js/helpers';
import * as C from '../constants/consilium';


// let consiliumCurrentParams;
export function getConsilium(queryParams) {
  // if (queryParams === 'async') {
  //   queryParams = consiliumCurrentParams;
  // } else {
  //   consiliumCurrentParams = queryParams;
  // }
  const data = queryParams;

  if (!queryParams.page) {
    data.page = 1;
  }

  if (!queryParams.page_size) {
    data.page_size = 9;
  }

  return (dispatch) => {
    dispatch(showLoading());
    dispatch({
      type: C.CONSILIUM_START,
    });
    customFetch(
      `${C.URL_API_CONSILIUM}`,
      'GET',
      data,
      {
        success: (result) => {
          dispatch({
            type: C.CONSILIUM_SUCCESS,
            payload: result,
          });
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.CONSILIUM_FAILURE,
            payload: error,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch({
            type: C.CONSILIUM_FAILURE,
            payload: error,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function resetConsilium() {
  return (dispatch) => {
    dispatch({
      type: C.CONSILIUM_HARD_RESET,
    });
  };
}

export function sendQuestion(data, callback) {
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      `${C.URL_API_CONSILIUM}`,
      'POST',
      { body: JSON.stringify(data) },
      {
        success: () => {
          dispatch({
            type: C.CONSILIUM_QUESTION_SUCCESS,
            message: 'Ваш вопрос добавлен',
          });
          setTimeout(() => {
            dispatch({
              type: C.CONSILIUM_NOTIFICATION_CANCEL,
            });
            // dispatch(getConsilium('async'));
            callback && callback();
          }, 0);
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.CONSILIUM_QUESTION_FAILURE,
            payload: error,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch({
            type: C.CONSILIUM_QUESTION_FAILURE,
            payload: error,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}


export function getCurrentConsilium(id) {
  return (dispatch) => {
    dispatch(showLoading());
    dispatch({
      type: C.CONSILIUM_START,
    });
    customFetch(
      `${C.URL_API_CONSILIUM}/${id}`,
      'GET',
      {},
      {
        success: (result) => {
          dispatch({
            type: C.CURRENT_CONSILIUM_SUCCESS,
            payload: result,
          });
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.CONSILIUM_FAILURE,
            payload: error,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch({
            type: C.CONSILIUM_FAILURE,
            payload: error,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function editConsilium(data, id, isDelete, callback) {
  let message = '';
  if (isDelete) {
    message = data.is_deleted ? 'Ваш вопрос удален' : 'Ваш вопрос восстановлен';
  } else {
    message = 'Ваш вопрос отредактирован';
  }
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      `${C.URL_API_CONSILIUM}/${id}`,
      'PATCH',
      { body: JSON.stringify(data) },
      {
        success: () => {
          dispatch({
            type: C.EDIT_CONSILIUM_SUCCESS,
            message,
          });
          setTimeout(() => {
            dispatch({
              type: C.CONSILIUM_NOTIFICATION_CANCEL,
            });
            callback && callback();
            // dispatch(getConsilium('async'));
          }, 0);
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.EDIT_CONSILIUM_FAILURE,
            payload: error,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch({
            type: C.EDIT_CONSILIUM_FAILURE,
            payload: error,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function updateFilter(filter) {
  return {
    type: C.CONSILIUM_FILTER,
    payload: filter,
  };
}
