// Auth
export const AUTH_START = "AUTH_START";
export const AUTH_SUCCESS = "AUTH_SUCCESS";
export const AUTH_FAIL = "AUTH_FAIL";
export const AUTH_LOGOUT = "AUTH_LOGOUT";
export const RESET_PASSWORD_START = "RESET_PASSWORD_START";
export const RESET_PASSWORD_EMAIL_SENT = "RESET_PASSWORD_EMAIL_SENT";
export const RESET_PASSWORD_SUCCESS = "RESET_PASSWORD_SUCCESS";
export const RESET_PASSWORD_FAIL = "RESET_PASSWORD_FAIL";
export const CHANGE_PASSWORD_START = "CHANGE_PASSWORD_START";
export const CHANGE_PASSWORD_SUCCESS = "CHANGE_PASSWORD_SUCCESS";
export const CHANGE_PASSWORD_FAIL = "CHANGE_PASSWORD_FAIL";

export type StartType = typeof AUTH_START;
export type SuccessType = typeof AUTH_SUCCESS;
export type FailType = typeof AUTH_FAIL;
export type LogoutType = typeof AUTH_LOGOUT;
export type ResetPasswordStartType = typeof RESET_PASSWORD_START;
export type ResetPasswordSuccessType = typeof RESET_PASSWORD_SUCCESS;
export type ResetPasswordEmailSentType = typeof RESET_PASSWORD_EMAIL_SENT;
export type ResetPasswordFailType = typeof RESET_PASSWORD_FAIL;
export type ChangePasswordStartType = typeof CHANGE_PASSWORD_START;
export type ChangePasswordSuccessType = typeof CHANGE_PASSWORD_SUCCESS;
export type ChangePasswordFailType = typeof CHANGE_PASSWORD_FAIL;

// User
export const USER_GET_PROFILE = "USER_GET_PROFILE";
export const USER_CLEAR_PROFILE = "USER_CLEAR_PROFILE";

export type GetUserProfileType = typeof USER_GET_PROFILE;
export type ClearUserProfileType = typeof USER_CLEAR_PROFILE;
