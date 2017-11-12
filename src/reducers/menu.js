import * as C from 'constants/menu';

const initialState = {
  states: {
    open: false,
    expand: false,
    openItem: false,
    openLogin: false,
  },
};

export default function app(state = initialState, action) {
  switch (action.type) {
    case C.MENU_UPDATE_STATES:
      return {
        ...state,
        states: Object.assign({}, state.states, action.payload),
      };

    default:
      return state;
  }
}
