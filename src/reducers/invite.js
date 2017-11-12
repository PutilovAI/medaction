import * as C from '../constants/invite';

const initialState = {

};

export default function videoteka(state = initialState, action) {
  switch (action.type) {
    case C.INVITE_SEND_SUCCESS:
      return {
        ...state,
        inviteMessage: action.payload,
        inviteResult: true,
      };
    case C.INVITE_SEND_FAIL:
      return {
        ...state,
        inviteMessage: action.payload,
        inviteResult: true,
      };
    case C.INVITE_SEND_RESET:
      return {
        ...state,
        inviteMessage: '',
        inviteResult: false,
      };
    default:
      return state;
  }
}
