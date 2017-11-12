import * as C from '../constants/staticPages';

const initialState = {

};

export default function videoteka(state = initialState, action) {
  switch (action.type) {
    case C.GET_STATIC_PAGES_SUCCESS:
      return {
        ...state,
        staticPage: action.payload,
        staticPageErrorStatus: null,
      };
    case C.GET_STATIC_PAGES_FAIL:
      return {
        ...state,
        staticPage: {},
        staticPageErrorStatus: action.payload.status,
      };
    case C.STATIC_PAGES_RESET:
      return {
        ...state,
        staticPage: {},
        staticPageErrorStatus: null,
      };
    default:
      return state;
  }
}
