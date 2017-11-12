import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { customFetch } from '../assets/js/helpers';
import * as C from '../constants/articles';
export function updateFilter(filter) {
  return {
    type: C.ARTICLES_FILTER,
    payload: filter,
  };
}

export function articlesListSuccess(articles, isSummary) {
  return {
    type: (isSummary ? C.ARTICLES_SUMMARY_SUCCESS : C.ARTICLES_LIST_SUCCESS),
    payload: articles,
  };
}

export function articlesListError(error, isSummary) {
  return {
    type: (isSummary ? C.ARTICLES_SUMMARY_ERROR : C.ARTICLES_LIST_ERROR),
    payload: error,
  };
}

export function articlesListCancel() {
  return {
    type: C.ARTICLES_LIST_CANCEL,
  };
}

export function getDiseasesSuccess(diseases) {
  return {
    type: C.DISEASES_IDS_SUCCES,
    payload: diseases,
  };
}

export function getDiseasesFailure() {
  return {
    type: C.DISEASES_IDS_FAILURE,
  };
}

export function getDiseasesCancel() {
  return {
    type: C.DISEASES_IDS_CANCEL,
  };
}

export function getTreatmentsSuccess(treatments) {
  return {
    type: C.TREATMENTS_IDS_SUCCES,
    payload: treatments,
  };
}

export function getTreatmentsFailure() {
  return {
    type: C.TREATMENTS_IDS_FAILURE,
  };
}

export function getTreatmentsCancel() {
  return {
    type: C.TREATMENTS_IDS_CANCEL,
  };
}

export function clearArticleData() {
  return {
    type: C.CLEAR_CURRENT_ARTICLE,
  };
}

export function getDiseasesByIds(ids) {
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      `${C.URL_DISEASES_IDS}`,
      'GET',
      { ids: ids.join(',') },
      {
        success: (result) => {
          dispatch(getDiseasesSuccess(result));
          dispatch(hideLoading());
        },
        error: () => {
          dispatch(getDiseasesFailure());
          dispatch(hideLoading());
        },
        exception: () => {
          dispatch(getDiseasesFailure());
          dispatch(hideLoading());
        },
        cancel: () => {
          dispatch(getDiseasesCancel());
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function getTreatmentsByIds(ids) {
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      `${C.URL_API_TREATMENTS_IDS}`,
      'GET',
      { ids: ids.join(',') },
      {
        success: (result) => {
          dispatch(getTreatmentsSuccess(result));
          dispatch(hideLoading());
        },
        error: () => {
          dispatch(getTreatmentsFailure());
          dispatch(hideLoading());
        },
        exception: () => {
          dispatch(getTreatmentsFailure());
          dispatch(hideLoading());
        },
        cancel: () => {
          dispatch(getTreatmentsCancel());
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function getArticles(queryParams, isSummary, activityType) {
  const data = queryParams;
  if (!queryParams.page) {
    data.page = 1;
  }

  if (!queryParams.page_size) {
    data.page_size = 9;
  }

  let url = C.URL_API_ARTICLES;
  // если это список материалов из активностей пользователя
  // и мы запрашиваем не просто статьи, а заявки на статьи
  if (activityType && activityType === 'request') {
    url = C.URL_API_ARTICLE_REQUESTS;
  }

  return (dispatch) => {
    dispatch(showLoading());
    dispatch({
      type: C.ARTICLES_LIST_START,
    });

    customFetch(
      url,
      'GET',
      data,
      {
        success: (result) => {
          dispatch(articlesListSuccess(result, isSummary));
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch(articlesListError(error, isSummary));
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch(articlesListError(error, isSummary));
          dispatch(hideLoading());
        },
        cancel: () => {
          dispatch(articlesListCancel());
          dispatch(hideLoading());
        },
      },
    );
  };
}

// получаем конкретный артикл по ID
export function getCurrentArticle(articleId) {
  return (dispatch) => {
    dispatch(showLoading());
    dispatch({
      type: C.ARTICLE_CURRENT_START,
    });

    customFetch(
      `${C.URL_API_ARTICLES}${articleId}/`,
      'GET',
      {},
      {
        success: (result) => {
          dispatch({
            type: C.ARTICLE_CURRENT_SUCCESS,
            payload: result,
          });
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.ARTICLE_CURRENT_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch({
            type: C.ARTICLE_CURRENT_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}

// отправка ответов на вопросы
export function articleQuizSendForm(formBody, id) {
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      C.URL_API_ARTICLE_QUIZ_COMPLETE,
      'POST',
      { body: JSON.stringify(formBody) },
      {
        success: () => {
          dispatch(getCurrentArticle(id));
          dispatch(hideLoading());
        },
      },
    );
  };
}

// отправка ответов на вопросы
export function getArticlePopular() {
  return (dispatch) => {
    dispatch(showLoading());
    dispatch({
      type: C.ARTICLE_POPULAR_START,
    });

    customFetch(
      `${C.URL_API_ARTICLE_POPULAR}?subject_type=article&page=1&page_size=3`,
      'GET',
      {},
      {
        success: (result) => {
          dispatch({
            type: C.ARTICLE_POPULAR_SUCCESS,
            payload: result,
          });
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.ARTICLE_POPULAR_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch({
            type: C.ARTICLE_POPULAR_SUCCESS,
            payload: error,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function removeRequest(id, callback) {
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      `${C.API_CREATE_ARTICLE}${id}`,
      'DELETE',
      {},
      {
        success: () => {
          if (callback) {
            callback();
          }
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch(hideLoading());
          dispatch({
            type: C.REMOVE_REQUEST_ERROR,
            payload: error,
          });
        },
        exception: (error) => {
          dispatch(hideLoading());
          dispatch({
            type: C.REMOVE_REQUEST_ERROR,
            payload: error,
          });
        },
      },
    );
  };
}

export function articlesCancel() {
  return (dispatch) => {
    dispatch({
      type: C.ARTICLES_CANCEL,
    });
  };
}
