import * as C from '../constants/videoteka';

const initialState = {
  filter: {},
  videolist: false,
  videosError: false,
  videosLoading: false,
  videosSummary: false,
  videosSummaryError: false,
};

export default function videoteka(state = initialState, action) {
  const newCurrentVideoState = state.currentVideo ? state.currentVideo.favorite : true;
  switch (action.type) {
    case C.TOGGLE_VIDEOTEKA_SUCCESS:
      return {
        ...state,
        currentVideo: Object.assign({}, state.currentVideo, { favorite: !newCurrentVideoState }),
      };
    case C.CURRENT_VIDEOTEKA_SUCCESS:
      return {
        ...state,
        videotekaErrorStatus: null,
        currentVideo: action.payload,
      };
    case C.VIDEOTEKA_FILTER:
      return {
        ...state,
        filter: action.payload,
      };
    case C.VIDEOTEKA_SUCCESS: {
      return {
        ...state,
        videotekaErrorStatus: null,
        videolist: action.payload,
      };
    }
    case C.VIDEOTEKA_SUMMARY_SUCCESS: {
      const data = action.payload;
      if (data.length) {
        data.push(data.shift());
      }
      return {
        ...state,
        videosSummary: data,
        videosSummaryError: false,
      };
    }
    case C.VIDEOTEKA_SUMMARY_ERROR:
      return {
        ...state,
        videosSummary: false,
        videosSummaryError: action.payload.error,
      };
    case C.VIDEOTEKA_FAILURE:
      return {
        ...state,
        videolist: false,
        currentVideo: false,
        videosError: action.payload.error,
        videotekaErrorStatus: action.payload.status,
      };
    case C.VIDEOTEKA_CANCEL:
      return {
        ...state,
        videosLoading: false,
        videotekaErrorStatus: null,
      };
    case C.VIDEOTEKA_START:
      return {
        ...state,
        videosLoading: true,
      };
    case C.COURSES_SUCCESS:
      return {
        ...state,
        courses: action.payload,
        coursesError: false,
        videotekaErrorStatus: null,
      };
    case C.COURSES_FAILURE:
      return {
        ...state,
        courses: false,
        coursesError: action.payload.error,
        videotekaErrorStatus: action.payload.status,
      };
    case C.THEMES_SUCCESS:
      return {
        ...state,
        themes: action.payload,
        videotekaErrorStatus: null,
      };
    case C.THEMES_FAILURE:
      return {
        ...state,
        themes: false,
        themesError: action.payload.error,
        videotekaErrorStatus: action.payload.status,
      };
    default:
      return state;
  }
}
