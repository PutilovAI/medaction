import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { customFetch } from '../assets/js/helpers';
import * as C from '../constants/videoteka';

export function updateFilter(filter) {
  return {
    type: C.VIDEOTEKA_FILTER,
    payload: filter,
  };
}

export function toggleFavoriteVideoteka(favorites) {
  return {
    type: C.TOGGLE_VIDEOTEKA_SUCCESS,
    payload: favorites,
  };
}

export function getVideotekaSuccess(videos, isSummary) {
  return {
    type: (isSummary ? C.VIDEOTEKA_SUMMARY_SUCCESS : C.VIDEOTEKA_SUCCESS),
    payload: videos,
  };
}

export function getVideotekaFailure(errors, isSummary) {
  return {
    type: (isSummary ? C.VIDEOTEKA_SUMMARY_ERROR : C.VIDEOTEKA_FAILURE),
    payload: errors,
  };
}

export function getVideotekaCancel() {
  return {
    type: C.VIDEOTEKA_CANCEL,
  };
}

export function getCourcesSuccess(data) {
  return {
    type: C.COURSES_SUCCESS,
    payload: data,
  };
}

export function getCurrentVideotekaSuccess(data) {
  return {
    type: C.CURRENT_VIDEOTEKA_SUCCESS,
    payload: data,
  };
}

export function getCourcesFailure(error) {
  return {
    type: C.COURSES_FAILURE,
    payload: error,
  };
}

export function getThemesSuccess(data) {
  return {
    type: C.THEMES_SUCCESS,
    payload: data,
  };
}

export function getThemesFailure(error) {
  return {
    type: C.THEMES_FAILURE,
    payload: error,
  };
}

export function getCourses() {
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      `${C.URL_API_COURSES}`,
      'GET',
      {},
      {
        success: (result) => {
          dispatch(getCourcesSuccess(result));
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch(getCourcesFailure(error));
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch(getCourcesFailure(error));
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function getThemesByIds(ids) {
  return (dispatch) => {
    dispatch(showLoading());
    dispatch({
      type: C.VIDEOTEKA_START,
    });

    customFetch(
      `${C.URL_API_THEMES}`,
      'GET',
      { ids: ids.join(',') },
      {
        success: (result) => {
          dispatch(getThemesSuccess(result));
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch(getThemesFailure(error));
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch(getThemesFailure(error));
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function getCurrentVideo(queryParams) {
  const data = queryParams;
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      `${C.URL_API_CURRENT_VIDEOTEKA}${data}`,
      'GET',
      {},
      {
        success: (result) => {
          dispatch(getCurrentVideotekaSuccess(result));
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch(getVideotekaFailure(error));
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch(getVideotekaFailure(error));
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function getVideoteka(queryParams, isSummary) {
  const data = queryParams;

  if (!queryParams.page) {
    data.page = 1;
  }

  if (!queryParams.page_size) {
    data.page_size = 9;
  }

  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      `${C.URL_API_VIDEOTEKA}`,
      'GET',
      isSummary ? { promo: true } : data,
      {
        success: (result) => {
          dispatch(getVideotekaSuccess(result, isSummary));
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch(getVideotekaFailure(error, isSummary));
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch(getVideotekaFailure(error, isSummary));
          dispatch(hideLoading());
        },
      },
    );
  };
}
