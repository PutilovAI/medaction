import { showLoading, hideLoading } from 'react-redux-loading-bar';

import * as C from '../constants/app';
import { customFetch } from '../assets/js/helpers';

export function userLoginSuccess(user) {
  return {
    type: C.USER_LOGIN_SUCCESS,
    payload: user,
  };
}
export function userUpdate(user) {
  return {
    type: C.USER_UPDATE,
    payload: user,
  };
}
export function userLoginFailure(errors) {
  return {
    type: C.USER_LOGIN_FAILURE,
    payload: errors,
  };
}
export function userLogout() {
  return {
    type: C.USER_LOGOUT,
  };
}
export function userInit() {
  return {
    type: C.USER_INIT,
  };
}

export function setMainLoaded() {
  return (dispatch) => {
    dispatch({
      type: C.MAIN_LOADED,
    });
  };
}

export function requestResearchItemMenu(email) {
  return (dispatch) => {
    customFetch(
      `${C.REQUEST_RESEARCH_MENU_URL}`,
      'GET',
      { mail: email },
      {
        success: (result) => {
          dispatch({
            type: C.REQUEST_RESEARCH_MENU_SUCCESS,
            payload: result,
          });
        },
        error: error => dispatch({
          type: C.REQUEST_RESEARCH_MENU_FAIL,
          payload: error,
        }),
        exception: error => dispatch({
          type: C.REQUEST_RESEARCH_MENU_FAIL,
          payload: error,
        }),
      },
      true,
    );
  };
}

export function userPostLogin(formBody) {
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      C.URL_API_LOGIN,
      'POST',
      { body: JSON.stringify(formBody) },
      {
        success: (result) => {
          dispatch({
            type: C.USER_LOGIN_SUCCESS,
            payload: result,
          });
          dispatch(requestResearchItemMenu(result.email));
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch(userLoginFailure(error));
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch(userLoginFailure(error));
          dispatch(hideLoading());
        },
      },
    );
  };
}
export function userPostLogout() {
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      C.URL_API_LOGOUT,
      'POST',
      { body: '' },
      {
        success: () => {
          dispatch(userLogout());
          dispatch(hideLoading());
        },
      },
      true,
    );
  };
}
// export function socialLogin(socialName) {
//   return (dispatch) => {
//     customFetch(
//       `${C.URL_API_SOCIAL_LOGIN}?social=${socialName}`,
//       'GET',
//       {},
//       {
//         success: (result) => {
//           console.log(result)
//         },
//         error: (error) => {
//           console.log(error)
//         },
//       },
//       true,
//     );
//   };
// }
// Загружаем данные пользователя при загрузке приложения и проверяем авторизован он или нет
export function userGetProfile() {
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      C.URL_API_PROFILE,
      'GET',
      {},
      {
        success: (result) => {
          dispatch(userLoginSuccess(result));
          dispatch(requestResearchItemMenu(result.email));
          dispatch(userInit());
          dispatch(hideLoading());
        },
        error: () => {
          dispatch(userInit());
          dispatch(hideLoading());
        },
      },
    );
  };
}

// получаем конкретный артикл по ID
export function getPromoMaterial() {
  return (dispatch) => {
    dispatch(showLoading());
    dispatch({
      type: C.PROMO_MATERIAL_START,
    });

    customFetch(
      `${C.URL_PROMO_MATERIAL}`,
      'GET',
      {},
      {
        success: (result) => {
          dispatch({
            type: C.PROMO_MATERIAL_SUCCESS,
            payload: result,
          });
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.PROMO_MATERIAL_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
        exception: (error) => {
          dispatch({
            type: C.PROMO_MATERIAL_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
        cancel: () => {
          dispatch({
            type: C.PROMO_MATERIAL_CANCEL,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function getMaterialsItemToMenu() {
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      C.URL_API_MATERIALS_ITEM_TO_MENU,
      'GET',
      {},
      {
        success: (result) => {
          dispatch({
            type: C.MATERIALS_ITEM_TO_MENU_SUCCESS,
            payload: result,
          });
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.MATERIALS_ITEM_TO_MENU_ERROR,
            payload: error,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}

export function getAllServices() {
  return (dispatch) => {
    dispatch(showLoading());
    customFetch(
      C.URL_ALL_SERVICES,
      'GET',
      {},
      {
        success: (result) => {
          dispatch({
            type: C.ALL_SERVICES_SUCCESS,
            payload: result,
          });
          dispatch(hideLoading());
        },
        error: (error) => {
          dispatch({
            type: C.ALL_SERVICES_FAIL,
            payload: error,
          });
          dispatch(hideLoading());
        },
      },
    );
  };
}
