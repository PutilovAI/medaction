import * as C from '../constants/app';
import * as Email from '../constants/email';
import { PROFILE_RESET_PASSWORD_CANCEL } from '../constants/profile';

const initialState = {
  isUserInit: false,
  auth: false,
  user: {},
  authErrors: {},
  promoMaterial: false,
  promoMaterialError: false,
  promoMaterialLoading: false,
  mainLoaded: false,
  remindSuccess: false,
  remindError: false,
  remindLoading: false,
};

export default function app(state = initialState, action) {
  switch (action.type) {
    case C.ALL_SERVICES_SUCCESS:
      return {
        ...state,
        allServices: action.payload,
      };
    case C.ALL_SERVICES_FAIL:
      return {
        ...state,
        allServices: [],
      };
    case C.MATERIALS_ITEM_TO_MENU_SUCCESS:
      return {
        ...state,
        materialMenuItems: action.payload,
      };
    case C.MATERIALS_ITEM_TO_MENU_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case Email.RESEND_EMAIL_START:
      return {
        ...state,
        resendEmailLoading: true,
      };
    case Email.RESEND_EMAIL_SUCCESS:
      return {
        ...state,
        resendEmailSuccess: true,
        resendEmailError: false,
        resendEmailLoading: false,
      };
    case Email.RESEND_EMAIL_ERROR:
      return {
        ...state,
        resendEmailSuccess: false,
        resendEmailError: true,
        resendEmailLoading: false,
      };
    case Email.RESEND_EMAIL_CANCEL:
      return {
        ...state,
        resendEmailSuccess: false,
        resendEmailError: false,
        resendEmailLoading: false,
      };
    case Email.VERIFY_EMAIL_START:
      return {
        ...state,
        verifyLoading: true,
      };
    case Email.VERIFY_EMAIL_SUCCESS:
      return {
        ...state,
        verifySuccess: true,
        verifyError: false,
        verifyLoading: false,
      };
    case Email.VERIFY_EMAIL_ERROR:
      return {
        ...state,
        verifySuccess: false,
        verifyError: true,
        veridyLoading: false,
      };
    case Email.VERIFY_EMAIL_CANCEL:
      return {
        ...state,
        verifySuccess: false,
        verifyError: false,
        verifyLoading: false,
        resendEmailSuccess: false,
        resendEmailError: false,
        resendEmailLoading: false,
      };

    case Email.REMIND_START:
      return {
        ...state,
        remindLoading: true,
      };
    case Email.REMIND_SUCCESS:
      return {
        ...state,
        remindSuccess: true,
        remindError: false,
        remindLoading: false,
      };
    case Email.REMIND_ERROR:
      return {
        ...state,
        remindSuccess: false,
        authErrors: { email: action.payload.error.email },
        authErrorsStatus: action.payload.status,
        remindLoading: false,
      };
    case PROFILE_RESET_PASSWORD_CANCEL:
    case Email.REMIND_CANCEL:
      return {
        ...state,
        remindSuccess: false,
        remindError: false,
        remindLoading: false,
      };
    case C.MAIN_LOADED:
      return {
        ...state,
        mainLoaded: true,
      };
    case C.PROMO_MATERIAL_START:
      return {
        ...state,
        promoMaterialLoading: true,
      };
    case C.PROMO_MATERIAL_SUCCESS:
      return {
        ...state,
        promoMaterial: action.payload,
        promoMaterialError: false,
      };
    case C.PROMO_MATERIAL_ERROR:
      return {
        ...state,
        promoMaterial: false,
        promoMaterialError: action.payload.error,
      };
    case C.PROMO_MATERIAL_CANCEL:
      return {
        ...state,
        promoMaterialLoading: false,
      };
    case C.USER_LOGIN_SUCCESS:
      return {
        ...state,
        auth: true,
        user: action.payload,
        profileUser: action.payload,
        authErrors: {},
        authErrorsStatus: null,
      };

    case C.USER_LOGIN_FAILURE:
      return {
        ...state,
        authErrors: action.payload.error,
        authErrorsStatus: action.payload.status,
      };
    case C.USER_LOGOUT:
      return {
        ...state,
        auth: false,
        user: {},
        authErrorsStatus: null,
      };
    case C.USER_INIT:
      return {
        ...state,
        isUserInit: true,
        authErrorsStatus: null,
      };
    case C.USER_UPDATE:
      return {
        ...state,
        user: action.payload,
        authErrorsStatus: null,
      };
    case C.REQUEST_RESEARCH_MENU_SUCCESS:
      return {
        ...state,
        hasResearch: action.payload.hasResearch,
      };
    case C.REQUEST_RESEARCH_MENU_FAIL:
      return {
        ...state,
        hasResearch: false,
      };
    default:
      return state;
  }
}
