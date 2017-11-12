const initialState = {
  fields: {},
  attachments: [],
  createArticleSuccess: false,
  createArticleError: false,
  createArticleLoading: false,
  articleEditLoading: false,
  articleEdit: false,
  articleEditError: false,
  articleEditSubmitLoading: false,
  articleEditSubmit: false,
  articleEditSubmitError: false,
};

export default function articleForm(state = initialState, action) {
  switch (action.type) {
    case 'EDIT_ARTICLE_SUBMIT_START':
      return {
        ...state,
        articleSEditSubmitLoading: true,
      };
    case 'EDIT_ARTICLE_SUBMIT_SUCCESS':
      return {
        ...state,
        articleEditSubmitLoading: false,
        articleEditSubmit: true,
        articleEditSubmitError: false,
      };
    case 'EDIT_ARTICLE_SUBMIT_ERROR':
      return {
        ...state,
        articleEditSubmitLoading: false,
        articleEditSubmit: false,
        articleEditSubmitError: JSON.parse(action.payload.error),
      };
    case 'EDIT_ARTICLE_SUBMIT_CANCEL':
      return {
        ...state,
        articleEditSubmitLoading: false,
        articleEditSubmit: false,
        articleEditSubmitError: false,
      };
    case 'EDIT_ARTICLE_START':
      return {
        ...state,
        articleEditLoading: true,
      };
    case 'EDIT_ARTICLE_SUCCESS':
      return {
        ...state,
        articleEditLoading: false,
        articleEdit: action.payload,
        articleEditError: false,
      };
    case 'EDIT_ARTICLE_ERROR':
      return {
        ...state,
        articleEditLoading: false,
        articleEdit: false,
        articleEditError: action.payload.status,
      };
    case 'EDIT_ARTICLE_CANCEL':
      return {
        ...state,
        articleEditLoading: false,
        articleEdit: false,
        articleEditError: false,
      };
    case 'UPDATE_FIELDS':
      return {
        ...state,
        fields: action.fields,
      };
    case 'UPDATE_ATTACHMENTS':
      return {
        ...state,
        attachments: action.attachments,
      };

    case 'CREATE_ARTICLE_START':
      return {
        ...state,
        createArticleSuccess: false,
        createArticleError: false,
        createArticleLoading: true,
      };
    case 'CREATE_ARTICLE_CANCEL':
      return {
        ...state,
        createArticleSuccess: false,
        createArticleError: false,
        createArticleLoading: false,
        fields: {},
        attachments: [],
        articleEditSubmitLoading: false,
        articleEditSubmit: false,
        articleEditSubmitError: false,
        articleEditLoading: false,
        articleEdit: false,
        articleEditError: false,
      };
    case 'CREATE_ARTICLE_SUCCESS':
      return {
        ...state,
        createArticleSuccess: true,
        createArticleError: false,
        createArticleLoading: false,
      };
    case 'CREATE_ARTICLE_ERROR':
      return {
        ...state,
        createArticleSuccess: false,
        createArticleError: action.payload.error,
        createArticleLoading: false,
      };

    default:
      return state;
  }
}
