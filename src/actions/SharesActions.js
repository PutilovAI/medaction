import { customFetch } from '../assets/js/helpers';
import * as C from '../constants/shares';


export function getSharesFromSocial(social, page) {
  let url = '';
  let FAILCONST = '';
  let SUCCESSCONST = '';
  let LOADINGCONST = '';
  let shareCount = '';
  let isTextResponse = false;
  // определяем урл для соцсети
  switch (social) {
    case 'fb':
      url = `${C.FB_SHARE_API}${page}`;
      FAILCONST = C.SHARES_FB_FAIL;
      SUCCESSCONST = C.SHARES_FB_SUCCESS;
      LOADINGCONST = C.SHARES_FB_LOADING;
      isTextResponse = false;
      break;
    case 'vk':
      url = `${C.VK_SHARE_API}${page}`;
      FAILCONST = C.SHARES_VK_FAIL;
      SUCCESSCONST = C.SHARES_VK_SUCCESS;
      LOADINGCONST = C.SHARES_VK_LOADING;
      isTextResponse = true;
      break;
    case 'odnk':
      url = `${C.ODNK_SHARE_API}${page}`;
      FAILCONST = C.SHARES_ODNK_FAIL;
      SUCCESSCONST = C.SHARES_ODNK_SUCCESS;
      LOADINGCONST = C.SHARES_ODNK_LOADING;
      isTextResponse = true;
      break;
    default:
      return false;
  }

  return (dispatch) => {
    dispatch({
      type: LOADINGCONST,
      payload: true,
    });
    customFetch(
      url,
      'GETNOCORS',
      {},
      {
        success: (result) => {
          switch (social) {
            case 'fb':
              shareCount = result.share.share_count;
              break;
            case 'odnk':
              shareCount = result.toString().slice(result.toString().indexOf(",'") + 2, result.toString().length);
              shareCount = shareCount.slice(0, shareCount.indexOf("')"));
              shareCount = parseInt(shareCount);
              break;
            case 'vk': {
              shareCount = result.toString().slice(result.toString().indexOf(',') + 2, result.toString().length);
              shareCount = shareCount.slice(0, shareCount.indexOf(')'));
              shareCount = parseInt(shareCount);
              break;
            }
            default:
              shareCount = 0;
              break;
          }
          if (!shareCount) {
            shareCount = 0;
          }
          dispatch({
            type: SUCCESSCONST,
            payload: shareCount,
          });
        },
        error: error => dispatch({
          type: FAILCONST,
          payload: `Не удалось получить share из соцсети ${social}, ${error}`,
        }),
        exception: error => dispatch({
          type: FAILCONST,
          payload: `Не удалось получить share из соцсети ${social}, ${error}`,
        }),
      },
      isTextResponse,
    );
  };
}

export function resetAllSharesFromSocials() {
  return (dispatch) => {
    dispatch({
      type: C.RESET_ALL_SHARES,
    });
  };
}
