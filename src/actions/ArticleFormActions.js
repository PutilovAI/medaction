import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { customFetch } from '../assets/js/helpers';
import * as C from '../constants/articles';

export function updateFields(fields) {
  return {
    type: 'UPDATE_FIELDS',
    fields,
  };
}
export function updateAuthors(authors) {
  return {
    type: 'UPDATE_AUTHORS',
    authors,
  };
}
export function updateAttachments(attachments) {
  return {
    type: 'UPDATE_ATTACHMENTS',
    attachments,
  };
}

export function cancelEditArticle() {
  return (dispatch) => {
    dispatch({
      type: C.EDIT_ARTICLE_SUBMIT_CANCEL,
    });
  };
}

export function registerEditArticle(formData, id) {
  return (dispatch) => {
    dispatch(showLoading());
    dispatch({
      type: C.EDIT_ARTICLE_SUBMIT_START,
    });

    formData.author_registration_next = '/auth/email/verify';

    customFetch(
      `${C.API_CREATE_ARTICLE}${id}/`,
      'PATCH',
      { body: JSON.stringify(formData) },
      {
        success: () => {
          dispatch({
            type: C.EDIT_ARTICLE_SUBMIT_SUCCESS,
          });
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.EDIT_ARTICLE_SUBMIT_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch({
            type: C.EDIT_ARTICLE_SUBMIT_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function registerNewArticle(formData) {
  return (dispatch) => {
    dispatch(showLoading());
    dispatch({
      type: C.CREATE_ARTICLE_START,
    });

    formData.author_registration_next = '/auth/email/verify';

    customFetch(
      C.API_CREATE_ARTICLE,
      'POST',
      { body: JSON.stringify(formData) },
      {
        success: () => {
          dispatch({
            type: C.CREATE_ARTICLE_SUCCESS,
          });
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.CREATE_ARTICLE_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch({
            type: C.CREATE_ARTICLE_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function getArticleForEdit(id) {
  return (dispatch) => {
    dispatch(showLoading());
    dispatch({
      type: C.EDIT_ARTICLE_START,
    });

    customFetch(
      `${C.API_CREATE_ARTICLE}${id}/`,
      'GET',
      {},
      {
        success: (result) => {
          dispatch({
            type: C.EDIT_ARTICLE_SUCCESS,
            payload: result,
          });
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.EDIT_ARTICLE_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch({
            type: C.EDIT_ARTICLE_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function cancelCreateArticle() {
  return (dispatch) => {
    dispatch({
      type: C.CREATE_ARTICLE_CANCEL,
    });
  };
}
