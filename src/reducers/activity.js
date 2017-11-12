import * as C from '../constants/activity';

const initialState = {
  favorites: {},
  favoritesFailure: '',
  favoritesPatch: false,
  favoritesPatchFailure: '',
  reminders: false,
  remindersFailure: false,
  remindersPatch: false,
  remindersPatchFailure: '',
  errorVotes: false,
  favoritesSummary: false,
  favoritesSummaryErrorStatus: false,
  commentsLoading: false,
  comments: false,
  commentsErrorStatus: false,
};

export default function videoteka(state = initialState, action) {
  switch (action.type) {
    case C.RESET_ACTIVITY_PAGE:
      return {
        ...state,
        favorites: {},
        favoritesFailure: false,
        favoritesErrorStatus: null,
        favoritesSummary: false,
        favoritesSummaryErrorStatus: false,
        commentsLoading: false,
        comments: false,
        commentsErrorStatus: false,
        reminders: false,
        remindersFailure: false,
        remindersLoading: false,
      };
    case C.VOTES_PATCH_SUCCESS:
      return {
        ...state,
      };
    case C.VOTES_PATCH_ERROR:
      return {
        ...state,
        errorVotes: action.payload.error,
      };
    case C.FAVORITES_SUMMARY_SUCCESS:
      return {
        ...state,
        favoritesSummary: action.payload,
        favoritesSummaryErrorStatus: false,
      };
    case C.FAVORITES_SUCCESS:
      return {
        ...state,
        favorites: action.payload,
        favoritesLoading: false,
        favoritesFailure: false,
        favoritesErrorStatus: false,
      };
    case C.FAVORITES_FAILURE:
      return {
        ...state,
        favorites: {},
        favoritesFailure: action.payload.error,
        favoritesErrorStatus: action.payload.status,
        favoritesLoading: false,
      };

    case C.COMMENTS_OWN_START:
      return {
        ...state,
        commentsLoading: true,
      };
    case C.COMMENTS_OWN_SUCCESS:
      return {
        ...state,
        comments: action.payload,
        commentsLoading: false,
        commentsErrorStatus: false,
      };
    case C.COMMENTS_OWN_FAILURE:
      return {
        ...state,
        commentsError: action.payload.status,
        comments: false,
        commentsLoading: true,
      };

    case C.FAVORITES_START:
      return {
        ...state,
        favoritesLoading: true,
      };
    case C.FAVORITES_CANCEL:
      return {
        favoritesFailure: false,
        favoritesErrorStatus: false,
        favoritesLoading: false,
        favoritres: {},
      };

    case C.FAVORITES_PATCH_SUCCESS:
      return {
        ...state,
        favoritesPatch: action.payload,
      };
    case C.FAVORITES_PATCH_FAILURE:
      return {
        ...state,
        favoritesFailure: action.payload.error,
      };

    case C.REMINDERS_START:
      return {
        ...state,
        remindersLoading: true,
      };
    case C.REMINDERS_SUCCESS:
      return {
        ...state,
        reminders: action.payload,
        remindersLoading: false,
        remindersFailure: false,
      };
    case C.REMINDERS_ERROR:
      return {
        ...state,
        reminders: false,
        remindersLoading: false,
        remindersFailure: action.payload.error,
      };
    case C.REMINDERS_CANCEL:
      return {
        ...state,
        remindersPatch: false,
      };

    case C.REMINDERS_PATCH_SUCCESS:
      return {
        ...state,
        remindersPatch: action.payload,
      };
    case C.REMINDERS_PATCH_FAILURE:
      return {
        ...state,
        remindersFailure: action.payload.error,
      };
    default:
      return state;
  }
}
