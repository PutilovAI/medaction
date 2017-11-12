import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { customFetch } from '../assets/js/helpers';
import * as C from '../constants/activity';
import { toggleFavoriteVideoteka } from './VideotekaActions';
import { getComments } from './CommentsAction';


export function getFavoritesCancel() {
  return {
    type: C.FAVORITES_CANCEL,
  };
}

export function getFavoritesPatchSuccess() {
  return {
    type: C.FAVORITES_PATCH_SUCCESS,
  };
}

export function getFavoritesPatchFailure(error) {
  return {
    type: C.FAVORITES_PATCH_FAILURE,
    payload: error,
  };
}

export function getRemindersPatchSuccess(favorites) {
  return {
    type: C.REMINDERS_PATCH_SUCCESS,
    payload: favorites,
  };
}

export function getRemindersPatchFailure(error) {
  return {
    type: C.REMINDERS_PATCH_FAILURE,
    payload: error,
  };
}

export function getFavoritesSummary() {
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      `${C.URL_API_FAVORITES}/`,
      'GET',
      {},
      {
        success: (result) => {
          dispatch({
            type: C.FAVORITES_SUMMARY_SUCCESS,
            payload: result,
          });
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.FAVORITES_SUMMARY_FAILURE,
            payload: error,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch({
            type: C.FAVORITES_SUMMARY_FAILURE,
            payload: error,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function getFavorites(queryParams) {
  return (dispatch) => {
    dispatch(showLoading());
    dispatch({
      type: C.FAVORITES_START,
    });

    const data = { ...queryParams };

    if (!data.page) {
      data.page = 1;
    }

    if (!data.page_size) {
      data.page_size = 9;
    }

    customFetch(
      `${C.URL_API_FAVORITES}/`,
      'GET',
      data,
      {
        success: (result) => {
          dispatch({
            type: C.FAVORITES_SUCCESS,
            payload: result,
          });
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.FAVORITES_FAILURE,
            payload: error,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch(getFavoritesPatchFailure(error));
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function getCommentsOwn(queryParams) {
  return (dispatch) => {
    dispatch(showLoading());
    dispatch({
      type: C.COMMENTS_OWN_START,
    });

    const data = { ...queryParams };

    if (!data.page) {
      data.page = 1;
    }

    if (!data.page_size) {
      data.page_size = 9;
    }

    customFetch(
      `${C.URL_API_COMMENTS_OWN}/`,
      'GET',
      data,
      {
        success: (result) => {
          dispatch({
            type: C.COMMENTS_OWN_SUCCESS,
            payload: result,
          });
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.COMMENTS_OWN_FAILURE,
            payload: error,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch({
            type: C.COMMENTS_OWN_FAILURE,
            payload: error,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function favoritesPatch(data, subject, id, callback) {
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      `${C.URL_API_FAVORITES}${subject}/${id}/`,
      'PATCH',
      { body: JSON.stringify(data) },
      {
        success: () => {
          dispatch(getFavoritesPatchSuccess());

          switch (subject) {
            case 'video':
              dispatch(toggleFavoriteVideoteka(data));
              // если это перезагрузка текущей страницы
              break;
            default:
              break;
          }

          if (callback) {
            callback();
          }
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch(getFavoritesPatchFailure(error));
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch(getFavoritesPatchFailure(error));
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function getReminders() {
  return (dispatch) => {
    dispatch(showLoading());
    dispatch({
      type: C.REMINDERS_START,
    });

    customFetch(
      `${C.URL_API_REMINDERS}`,
      'GET',
      {},
      {
        success: (result) => {
          dispatch({
            type: C.REMINDERS_SUCCESS,
            payload: result,
          });
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.REMINDERS_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch({
            type: C.REMINDERS_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function remindersPatch(data, subject, id, callback) {
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      `${C.URL_API_REMINDERS}${subject}/${id}/`,
      'PATCH',
      { body: JSON.stringify(data) },
      {
        success: () => {
          if (callback) {
            callback();
          } else {
            dispatch(getRemindersPatchSuccess(data));
          }
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch(getRemindersPatchFailure(error));
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch(getRemindersPatchFailure(error));
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function patchVotes(data, subject, id, parentSubject, parentId, flag) {
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      `${C.URL_API_VOTES}${subject}/${id}/`,
      'PATCH',
      { body: JSON.stringify(data) },
      {
        success: () => {
          dispatch({
            type: C.VOTES_PATCH_SUCCESS,
          });
          dispatch(getComments(parentSubject, parentId, flag));
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.VOTES_PATCH_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch({
            type: C.VOTES_PATCH_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function resetActivityPage() {
  return (dispatch) => {
    dispatch({
      type: C.RESET_ACTIVITY_PAGE,
    });
  };
}
