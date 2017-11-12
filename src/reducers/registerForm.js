import * as C from '../constants/app';

const initialState = {
  fields: {},
  fieldsErrors: {},
  formSendSuccess: false,
  formSendSuccessMessage: null,
  changePasswordSuccess: false,
  changePasswordError: false,
};

export default function articleForm(state = initialState, action) {
  switch (action.type) {
    case C.UNBIND_SOCIAL_SUCCESS:
      return {
        ...state,
        unBindSocialError: '',
      };
    case C.UNBIND_SOCIAL_FAIL:
      return {
        ...state,
        unBindSocialError: action.payload,
      };
    case C.REGISTER_CANCEL:
      return {
        ...state,
        formSendSuccess: false,
        formSendSuccessMessage: false,
        changePasswordSuccess: false,
        changePasswordError: false,
        editProfileSuccess: false,
        fields: {},
        fieldsError: false,
      };

    case C.REGISTER_FORM_UPDATE_FIELDS:
      return {
        ...state,
        fields: action.payload,
      };

    case C.REGISTER_FORM_SEND_SUCCESS:
      return {
        ...state,
        formSendSuccess: true,
        formSendSuccessMessage: action.payload,
      };

    case C.REGISTER_FORM_SEND_FAILURE:
      return {
        ...state,
        fieldsErrors: action.payload.error,
      };

    case C.REGISTER_FORM_RESET:
      return {
        ...state,
        formSendSuccess: false,
        formSendSuccessMessage: null,
        fields: {},
        fieldsErrors: {},
      };

    case C.CHANGE_PASSWORD_COMPLETE:
      return {
        ...state,
        changePasswordSuccess: true,
        changePasswordError: false,
      };

    case C.CHANGE_PASSWORD_ERROR: {
      return {
        ...state,
        changePasswordError: action.payload.error,
        changePasswordSuccess: false,
      };
    }

    case C.EDIT_PROFILE_SUCCESS: {
      return {
        ...state,
        editProfileSuccess: true,
        fieldsErrors: {},
      };
    }

    case C.EDIT_PROFILE_ERROR: {
      return {
        ...state,
        editProfileSuccess: false,
        fieldsErrors: JSON.parse(action.payload.error),
      };
    }

    default:
      return state;
  }
}
