export const SITE_URL = "https://mattlane.us";
export const SITE_DOMAIN = new URL(SITE_URL).hostname;
export const EMAIL_SUBSCRIBED_STORAGE_KEY = "email-subscribed";
export const EMAIL_SIGNUP_DISMISSED_STORAGE_KEY = "email-signup-dismissed-at";
export const EMAIL_SIGNUP_DISMISS_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

export const EMAIL_SIGNUP_VIEW_EVENT = "email-signup-view";
export const EMAIL_SIGNUP_SUBMIT_SUCCESS_EVENT = "email-signup-submit-success";
export const EMAIL_SIGNUP_SUBMIT_ERROR_EVENT = "email-signup-submit-error";
export const EMAIL_SIGNUP_DISMISSED_EVENT = "email-signup-dismissed";

export const EMAIL_SIGNUP_MODAL_QUERY_PARAM = "subscribe";
