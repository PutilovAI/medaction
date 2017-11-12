import * as C from '../constants/shares';

const initialState = {
  shareVk: null,
  shareFb: null,
  shareOdnk: null,
  shareVkLoading: false,
  shareFbLoading: false,
  shareOdnkLoading: false,
};

export default function videoteka(state = initialState, action) {
  switch (action.type) {
    case C.RESET_ALL_SHARES:
      return {
        ...state,
        shareVk: null,
        shareFb: null,
        shareOdnk: null,
        shareVkLoading: false,
        shareFbLoading: false,
        shareOdnkLoading: false,
      };
    case C.SHARES_VK_SUCCESS:
      return {
        ...state,
        shareVk: action.payload,
        shareVkLoading: false,
      };
    case C.SHARES_FB_SUCCESS:
      return {
        ...state,
        shareFb: action.payload,
        shareFbLoading: false,
      };
    case C.SHARES_ODNK_SUCCESS:
      return {
        ...state,
        shareOdnk: action.payload,
        shareOdnkLoading: false,
      };
    case C.SHARES_VK_FAIL:
      return {
        ...state,
        shareVk: 0,
        // shareVk: action.payload,
        shareVkLoading: false,
      };
    case C.SHARES_FB_FAIL:
      return {
        ...state,
        shareFb: 0,
        // shareFb: action.payload,
        shareFbLoading: false,
      };
    case C.SHARES_ODNK_FAIL:
      return {
        ...state,
        shareOdnk: 0,
        // shareOdnk: action.payload,
        shareOdnkLoading: false,
      };
    case C.SHARES_VK_LOADING:
      return {
        ...state,
        shareVkLoading: action.payload,
      };
    case C.SHARES_FB_LOADING:
      return {
        ...state,
        shareFbLoading: action.payload,
      };
    case C.SHARES_ODNK_LOADING:
      return {
        ...state,
        shareOdnkLoading: action.payload,
      };
    default:
      return state;
  }
}
