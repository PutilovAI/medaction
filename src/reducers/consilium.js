import * as C from '../constants/consilium';

const initialState = {
  themes: false,
  themesError: false,
  themesLoading: false,
};

export default function consilium(state = initialState, action) {
  switch (action.type) {
    case C.CONSILIUM_HARD_RESET:
      return {
        ...state,
        consiliumLoading: false,
        consilium: {
          count: -1,
          results: [],
        },
        consiliumMessage: '',
        consiliumFailureStatus: null,
        currentConsilium: {
          attachments: [],
          title: '',
          full_text: '',
          date_created: '2015-04-25T07:46:24.218000Z',
          user: {
            avatar: '',
            first_name: '',
            last_name: '',
            middle_name: '',
            birthdate: '',
            city: '',
            office: '',
            academic_degree: '',
            academic_rank: '',
            id: null,
          },
        },
      };
    case C.CONSILIUM_START:
      return {
        ...state,
        consiliumLoading: true,
      };
    case C.CONSILIUM_SUCCESS:
      return {
        ...state,
        consilium: action.payload,
        consiliumLoading: false,
      };
    case C.CONSILIUM_FAILURE:
      return {
        ...state,
        consiliumMessage: action.payload.error,
        consiliumFailureStatus: action.payload.status,
        consiliumLoading: false,
      };
    case C.CONSILIUM_QUESTION_FAILURE:
      return {
        ...state,
        consiliumMessage: action.payload.error,
      };
    case C.CONSILIUM_CANCEL:
      return {
        ...state,
        consiliumMessage: '',
        consiliumLoading: false,
        consiliumFailureStatus: null,
      };
    case C.CONSILIUM_QUESTION_SUCCESS:
      return {
        ...state,
        consiliumAskQuestionSuccess: true,
        consiliumMessage: action.message,
      };
    case C.CURRENT_CONSILIUM_SUCCESS:
      return {
        ...state,
        currentConsilium: action.payload,
      };
    case C.CONSILIUM_NOTIFICATION_CANCEL:
      return {
        ...state,
        consiliumAskQuestionSuccess: false,
        consiliumMessage: '',
        consiliumFailureStatus: null,
      };
    case C.EDIT_CONSILIUM_SUCCESS:
      return {
        ...state,
        consiliumMessage: action.message,
      };
    case C.EDIT_CONSILIUM_FAILURE:
      return {
        ...state,
        consiliumMessage: action.payload.error,
      };
    case C.CONSILIUM_FILTER:
      return {
        ...state,
        filter: action.payload,
      };
    default:
      return state;
  }
}
