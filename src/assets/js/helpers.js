export function checkPassword(str) {
  // at least one number, one lowercase and one uppercase letter
  // at least 8 characters
  const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  return re.test(str);
}

/* Функция определяющая выбор окончания из массивов строк */
export function endingWords(words, num) {
  num = typeof num !== 'undefined' ? num : 1;

  function numeric(num) {
    let arr = String(num).split(''),
      arrEnd = arr[arr.length - 1],
      count = 1;
    if (
      parseInt(arrEnd, 10) === 0 ||
            (parseInt(arrEnd, 10) >= 5 && parseInt(arrEnd) <= 9) ||
            (parseInt(`${arr[arr.length - 2]}${arrEnd}`, 10) >= 11 &&
                parseInt(`${arr[arr.length - 2]}${arrEnd}`, 10) <= 19)
    ) {
      count = 2;
    } else if (arr[arr.length - 1] === '1') {
      count = 0;
    }
    return count;
  }
  if (typeof words !== 'undefined') {
    if (Array.isArray(words)) {
      return words[numeric(num)];
    }
    return words;
  }
  return false;
}
// Получаем инициалы имени. Первые буквы каждого слова
export function getInitialsName(name) {
  let initials = '';

  if (typeof name === 'undefined') return false;

  name.split(' ').forEach((word) => {
    initials += word[0];
  });

  return initials;
}

// Тормозилка
export function throttle(func, ms) {
  let timer = '';
  const self = this;

  function wrapper() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(self, arguments);
    }, ms);
  }

  return wrapper;
}

// Ограничитель длины строки в зависимости от высоты
export function limitRow(options) {
  const { rows = 2, element = null, text: defText = null} = options;
  if (!element) return false;

  const elStyles = getComputedStyle(element);

  let { lineHeight, width } = elStyles;
  lineHeight = `${Math.ceil(parseFloat(lineHeight))}px`;

  const maxHeight = Math.floor(parseInt(lineHeight)) * rows;
  let newText = defText || element.innerHTML;

  const cloneEl = element.cloneNode(true);
  const container = document.getElementById('columns');
  let cloneHeight = null;

  cloneEl.style.width = width;
  cloneEl.style.position = 'absolute';
  cloneEl.style.left = '-9999px';
  cloneEl.style.top = '-9999px';
  cloneEl.style.lineHeight = lineHeight;

  container.append(cloneEl);
  cloneEl.innerHTML = newText;

  cloneHeight = cloneEl.offsetHeight;

  if (cloneHeight > maxHeight) {
    while (cloneHeight > maxHeight) {
      newText = cloneEl.innerHTML;
      newText = newText.slice(0, -6);
      cloneEl.innerHTML = newText;
      cloneHeight = cloneEl.offsetHeight;
    }

    newText = `${cloneEl.innerHTML}...`;
    cloneEl.innerHTML = newText;
    cloneHeight = cloneEl.offsetHeight;

    while (cloneHeight > maxHeight) {
      newText = cloneEl.innerHTML.slice(0, -4);

      newText += '...';
      cloneEl.innerHTML = newText;
      cloneHeight = cloneEl.offsetHeight;
    }
  }
  element.innerHTML = newText;

  container.innerHTML = '';

  return newText;
}

// Получаем куку по имени
export function getCookie(name) {
  const matches = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`),
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

// Обертка для запросов на сервер
export function customFetch(url = false, method = 'POST', data = {}, callback = {}, isTextResponse) {
  const	defaultReturn = () => false;
  const {
    success = defaultReturn,
    error = defaultReturn,
    // exception = defaultReturn,
    exception = (ex) => { console.log(ex); },
    cancel = defaultReturn } = callback;

  if (!url) {
    exception();
    cancel();
  }
  // дефолтные хедеры
  const HEADERS = {
    POST: {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
        'X-Forwarded-Host': `${THEME.host}`,
      },
      credentials: 'include',
    },
    GET: {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Forwarded-Host': `${THEME.host}`,
      },
      credentials: 'include',
    },
    GETNOCORS: {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'no-cors',
      credentials: 'include',
    },
    PATCH: {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
        'X-Forwarded-Host': `${THEME.host}`,
      },
      credentials: 'include',
    },
    DELETE: {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
        'X-Forwarded-Host': `${THEME.host}`,
      },
      credentials: 'include',
    },
    PUT: {
      method: 'PUT',
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
        'X-Forwarded-Host': `${THEME.host}`,
      },
      credentials: 'include',
    },
  };

  let headersData = Object.assign({}, HEADERS[method], data);
  let myUrl = url;

  if (method === 'GET') {
    headersData = Object.assign(HEADERS.GET);
    if (Object.keys(data).length > 0) {
      myUrl += '?';
    }
    myUrl += Object.keys(data).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`).join('&');
  }
  if (method === 'GETNOCORS') {
    headersData = Object.assign(HEADERS.GETNOCORS);
    if (Object.keys(data).length > 0) {
      myUrl += '?';
    }
    myUrl += Object.keys(data).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`).join('&');
  }

  const successStatusCodes = [0, 200, 201, 202, 203, 304];
  fetch(myUrl, Object.assign({}, headersData, data))
    .then((response) => {
      if (response.status === 404) {
        return { data: { detail: 'error' }, status: 404 };
      } else if (response.status === 500) {
        return { data: { detail: 'error' }, status: 500 };
      }
      // если мы получаем текстовые данные (например, в капче)
      if (isTextResponse || method === 'PATCH') {
        return response
          .text()
          .then(text => ({ data: text, status: response.status }));
      }

      // иначе преобразуем данные в json
      return response
        .json()
        .then(json => ({ data: json, status: response.status }));
    })
    .then((result) => {
      if (successStatusCodes.indexOf(result.status) > -1) {
        success(result.data);
      } else {
        error({ error: result.data, status: result.status });
      }
      cancel();
    })
    .catch((ex) => {
      exception({ error: { detail: ex }, status: 500 });
      cancel();
    });
}

// PascalCase
export function convertPascalCase(str = '', delimiter = '_') {
  return str.split(delimiter).map(word => (word[0].toUpperCase() + word.slice(1))).join('');
}

// YouTube parce video id
export function getYoutubePreview(url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? `http://img.youtube.com/vi/${match[7]}/0.jpg` : false;
}

let hashFragment = '';
let observer = null;
let asyncTimerId = null;

function reset() {
  hashFragment = '';
  if (observer !== null) observer.disconnect();
  if (asyncTimerId !== null) {
    window.clearTimeout(asyncTimerId);
    asyncTimerId = null;
  }
}

function getElAndScroll() {
  const element = document.getElementById(hashFragment);
  if (element !== null) {
    element.scrollIntoView();
    reset();
    return true;
  }
  return false;
}

function hashLinkScroll() {
  // Push onto callback queue so it runs after the DOM is updated
  window.setTimeout(() => {
    if (getElAndScroll() === false) {
      if (observer === null) {
        observer = new MutationObserver(getElAndScroll);
      }
      observer.observe(document, { attributes: true, childList: true, subtree: true });
      // if the element doesn't show up in 10 seconds, stop checking
      asyncTimerId = window.setTimeout(() => {
        reset();
      }, 10000);
    }
  }, 0);
}
export function handleClick(hashString) {
  reset();
  if (typeof hashString === 'string') {
    hashFragment = hashString.split('#').slice(1).join('#');
  } else if (typeof hashString === 'object' && typeof hashString.hash === 'string') {
    hashFragment = hashString.hash.replace('#', '');
  }
  if (hashFragment !== '') hashLinkScroll();
}
