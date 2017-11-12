export const URL_API = `${API_URL}`;

// отправка линка на подтверждение имэйла
export const URL_RESEND_EMAIL = `${API_URL}/users/registration/confirm/`;
export const RESEND_EMAIL_START = 'RESEND_EMAIL_START';
export const RESEND_EMAIL_SUCCESS = 'RESEND_EMAIL_SUCCESS';
export const RESEND_EMAIL_ERROR = 'RESEND_EMAIL_ERROR';
export const RESEND_EMAIL_CANCEL = 'RESEND_EMAIL_CANCEL';

// отправка линка на сброс пароля на почту
export const URL_API_REMIND = `${URL_API}/users/password/reset/`;
export const REMIND_START = 'REMIND_START';
export const REMIND_SUCCESS = 'REMIND_SUCCESS';
export const REMIND_ERROR = 'REMIND_ERROR';
export const REMIND_CANCEL = 'REMIND_CANCEL';

// проверка привязки почты
// отправка линка на сброс пароля на почту
export const URL_VERIFY_EMAIL = `${URL_API}/users/registration/complete/`;
export const VERIFY_EMAIL_START = 'VERIFY_EMAIL_START';
export const VERIFY_EMAIL_SUCCESS = 'VERIFY_EMAIL_SUCCESS';
export const VERIFY_EMAIL_ERROR = 'VERIFY_EMAIL_ERROR';
export const VERIFY_EMAIL_CANCEL = 'VERIFY_EMAIL_CANCEl';
