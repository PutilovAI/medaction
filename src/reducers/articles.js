import * as C from '../constants/articles';

const initialState = {
  filter: {},
  list: {},
  listSummary: false,
  listSummaryError: false,
  listSummaryLoading: false,
  listLoading: false,
  listError: {},
  articleQuizes: {},
  article: false,

  articlePopularLoading: false,
  articlePopularList: false,
  articlePopularError: false,
  articleErrorStatus: false,
};

export default function articleList(state = initialState, action) {
  switch (action.type) {
    case C.ARTICLES_CANCEL:
      return {
        ...state,
        articlePopularLoading: false,
        articlePopularList: false,
        articlePopularError: false,
        list: {},
        listSummary: false,
        listSummaryError: false,
        listSummaryLoading: false,
        listLoading: false,
        listError: {},
        articleQuizes: {},
        article: false,
        articleErrorStatus: false,
      };
    case C.ARTICLE_POPULAR_START:
      return {
        ...state,
        articlePopularLoading: true,
      };
    case C.ARTICLE_POPULAR_SUCCESS:
      return {
        ...state,
        articlePopularLoading: false,
        articlePopularList: action.payload,
        articlePopularError: false,
      };
    case C.ARTICLE_POPULAR_ERROR:
      return {
        ...state,
        articlePopularLoading: false,
        articlePopularList: false,
        articlePopularError: action.payload.error,
      };
    case C.ARTICLE_POPULAR_CANCEL:
      return {
        ...state,
        articlePopularList: false,
        articlePopularError: false,
        articlePopularLoading: false,
      };

    case C.CLEAR_CURRENT_ARTICLE:
      return {
        ...state,
        article: false,
      };
    case C.ARTICLES_FILTER:
      return {
        ...state,
        filter: action.payload,
      };
    case C.ARTICLES_LIST_START:
      return {
        ...state,
        listLoading: true,
        listSummaryLoading: true,
      };
    case C.ARTICLES_LIST_SUCCESS:
      return {
        ...state,
        list: action.payload,
        articleErrorStatus: false,
      };
    case C.ARTICLES_SUMMARY_SUCCESS:
      return {
        ...state,
        listSummary: action.payload,
      };
    case C.ARTICLES_SUMMARY_ERROR:
      return {
        ...state,
        listSummaryError: action.payload.error,
      };
    case C.ARTICLES_LIST_ERROR:
      return {
        ...state,
        list: false,
        listError: action.payload.error,
      };
    case C.ARTICLES_LIST_CANCEL:
      return {
        ...state,
        listLoading: false,
        listSummaryLoading: false,
      };

    case C.ARTICLE_CURRENT_START:
      return {
        ...state,
        articleLoading: true,
      };
    case C.ARTICLE_CURRENT_SUCCESS:
      return {
        ...state,
        article: action.payload,
        articleError: false,
        articleLoading: false,
        articleErrorStatus: action.payload.false,
      };
    case C.ARTICLE_CURRENT_ERROR:
      console.log(action.payload.error, action.payload.status);
      return {
        ...state,
        article: false,
        articleError: action.payload.error,
        articleLoading: false,
        articleErrorStatus: action.payload.status,
      };

    case C.DISEASES_IDS_SUCCES:
      return {
        ...state,
        diseases: action.payload,
        diseasesError: false,
      };
    case C.DISEASES_IDS_FAILURE:
      return {
        ...state,
        diseases: false,
        diseasesError: action.payload.error,
      };
    case C.DISEASES_IDS_CANCEL:
      return {
        ...state,
        diseasesError: false,
      };
    case C.TREATMENTS_IDS_SUCCES:
      return {
        ...state,
        treatments: action.payload,
        treatmentsError: false,
      };
    case C.TREATMENTS_IDS_FAILURE:
      return {
        ...state,
        treatments: false,
        treatmentsError: action.payload.error,
      };
    case C.TREATMENTS_IDS_CANCEL:
      return {
        ...state,
        treatmentsError: false,
      };
    default:
      return state;
  }
}
