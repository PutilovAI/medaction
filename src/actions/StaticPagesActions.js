import { showLoading, hideLoading } from 'react-redux-loading-bar';

import { customFetch } from '../assets/js/helpers';
import * as C from '../constants/staticPages';


export function getStaticPage(slug) {
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      `${C.URL_GET_STATIC_PAGES}${slug}`,
      'GET',
      {},
      {
        success: (result) => {
          dispatch({
            type: C.GET_STATIC_PAGES_SUCCESS,
            payload: result,
          });
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.GET_STATIC_PAGES_FAIL,
            payload: error,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch({
            type: C.GET_STATIC_PAGES_FAIL,
            payload: error,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function resetStaticPage() {
  return (dispatch) => {
    dispatch({
      type: C.STATIC_PAGES_RESET,
    });
  };
}
