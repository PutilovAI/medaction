import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { customFetch } from '../assets/js/helpers';
import * as C from '../constants/news';


// let consiliumCurrentParams;
export function getNews(queryParams) {
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
      type: C.NEWS_START,
    });
    customFetch(
      `${C.URL_API_NEWS}`,
      'GET',
      data,
      {
        success: (result) => {
          dispatch({
            type: C.NEWS_SUCCESS,
            payload: result,
          });
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.NEWS_FAILURE,
            payload: error,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch({
            type: C.NEWS_FAILURE,
            payload: error,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function resetNews() {
  return (dispatch) => {
    dispatch({
      type: C.NEWS_HARD_RESET,
    });
  };
}

export function getCurrentNews(id) {
  return (dispatch) => {
    dispatch(showLoading());
    dispatch({
      type: C.NEWS_START,
    });
    customFetch(
      `${C.URL_API_NEWS}/${id}`,
      'GET',
      {},
      {
        success: (result) => {
          dispatch({
            type: C.CURRENT_NEWS_SUCCESS,
            payload: result,
          });
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.NEWS_FAILURE,
            payload: error,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch({
            type: C.NEWS_FAILURE,
            payload: error,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}
