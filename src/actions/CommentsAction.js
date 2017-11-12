import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { customFetch } from '../assets/js/helpers';
import * as C from '../constants/comments';

export function getCommentsSuccess(comments) {
  return {
    type: C.COMMENTS_SUCCESS,
    payload: comments,
  };
}

export function getCommentsFailure(comments) {
  return {
    type: C.COMMENTS_FAILURE,
    payload: comments,
  };
}

export function getCommentsCancel() {
  return {
    type: C.COMMENTS_CANCEL,
  };
}

export function getComments(subject, id, isFull) {
  const url = isFull ? '?all=' : '';
  return (dispatch) => {
    dispatch(showLoading());
    dispatch({
      type: C.COMMENTS_START,
    });
    customFetch(
      `${C.URL_API_COMMENTS}${subject}/${id}${url}`,
      'GET',
      {},
      {
        success: (result) => {
          dispatch({
            type: C.COMMENTS_SUCCESS,
            payload: result,
          });
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch(getCommentsFailure(error));
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch(getCommentsFailure(error));
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function commentsAdd(data, subject, id, method, subjectId, callback) {
  // костыль для урла по просьбе Жени)
  const url = method === 'PATCH' ? `${C.URL_API_COMMENTS}${subjectId}/` : `${C.URL_API_COMMENTS}${subject}/${id}/`;
  const message = method === 'PATCH' ? 'Ваш комментарий отредактирован' : 'Комментарий добавлен';
  return (dispatch) => {
    dispatch(showLoading());
    dispatch({
      type: C.COMMENTS_START,
    });
    customFetch(
      url,
      method,
      { body: JSON.stringify(data) },
      {
        success: () => {
          dispatch({
            type: C.COMMENTS_POST_SUCCESS,
            message,
          });
          setTimeout(() => {
            dispatch({
              type: C.COMMENT_NOTIFICATION_CANCEL,
            });
          }, 0);
          // в случае успеха запрашиваем комменты для обновления
          callback && callback();
          // dispatch(getComments(subject, id, true));
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch(getCommentsFailure(error));
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch(getCommentsFailure(error));
          dispatch(hideLoading());
        },
      },
    );
  };
}
