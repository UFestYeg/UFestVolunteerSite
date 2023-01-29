// Auth
export const AUTH_START = "AUTH_START";
export const AUTH_SUCCESS = "AUTH_SUCCESS";
export const AUTH_EMAIL_SENT = "AUTH_EMAIL_SENT";
export const AUTH_ACTIVATION = "AUTH_ACTIVATION";
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
export type EmailSentType = typeof AUTH_EMAIL_SENT;
export type ActivationType = typeof AUTH_ACTIVATION;
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
export const USER_GET_PROFILE_START = "USER_GET_PROFILE_START";
export const USER_GET_PROFILE_SUCCESS = "USER_GET_PROFILE_SUCCESS";
export const USER_GET_VIEWED_PROFILE_SUCCESS =
    "USER_GET_VIEWED_PROFILE_SUCCESS";
export const USER_GET_PROFILE_FAIL = "USER_GET_PROFILE_FAIL";
export const USER_CLEAR_PROFILE = "USER_CLEAR_PROFILE";
export const UPDATE_PROFILE_START = "UPDATE_PROFILE_START";
export const UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS";
export const UPDATE_PROFILE_FAIL = "UPDATE_PROFILE_FAIL";

export type GetUserProfileStartType = typeof USER_GET_PROFILE_START;
export type GetUserProfileSuccessType = typeof USER_GET_PROFILE_SUCCESS;
export type GetViewedUserProfileSuccessType =
    typeof USER_GET_VIEWED_PROFILE_SUCCESS;
export type GetUserProfileFailType = typeof USER_GET_PROFILE_FAIL;
export type ClearUserProfileType = typeof USER_CLEAR_PROFILE;
export type UpdateProfileStartType = typeof UPDATE_PROFILE_START;
export type UpdateProfileSuccessType = typeof UPDATE_PROFILE_SUCCESS;
export type UpdateProfileFailType = typeof UPDATE_PROFILE_FAIL;

// Volunteer
export const GET_VOLUNTEER_CATEGORY_TYPES = "GET_VOLUNTEER_CATEGORY_TYPES";
export const GET_VOLUNTEER_CATEGORIES_START = "GET_VOLUNTEER_CATEGORIES_START";
export const GET_VOLUNTEER_CATEGORIES_SUCCESS =
    "GET_VOLUNTEER_CATEGORIES_SUCCESS";
export const GET_VOLUNTEER_CATEGORIES_FAIL = "GET_VOLUNTEER_CATEGORIES_FAIL";
export const GET_MAPPED_VOLUNTEER_ROLES_START =
    "GET_MAPPED_VOLUNTEER_ROLES_START";
export const GET_MAPPED_VOLUNTEER_ROLES_SUCCESS =
    "GET_MAPPED_VOLUNTEER_ROLES_SUCCESS";
export const GET_MAPPED_VOLUNTEER_ROLES_FAIL =
    "GET_MAPPED_VOLUNTEER_ROLES_FAIL";
export const ACCEPT_REQUEST_START = "ACCEPT_REQUEST_START";
export const ACCEPT_REQUEST_SUCCESS = "ACCEPT_REQUEST_SUCCESS";
export const ACCEPT_REQUEST_FAIL = "ACCEPT_REQUEST_FAIL";
export const DENY_REQUEST_START = "DENY_REQUEST_START";
export const DENY_REQUEST_SUCCESS = "DENY_REQUEST_SUCCESS";
export const DENY_REQUEST_FAIL = "DENY_REQUEST_FAIL";
export const CHANGE_REQUEST_ROLE_START = "CHANGE_REQUEST_ROLE_START";
export const CHANGE_REQUEST_ROLE_SUCCESS = "CHANGE_REQUEST_ROLE_SUCCESS";
export const CHANGE_REQUEST_ROLE_FAIL = "CHANGE_REQUEST_ROLE_FAIL";
export const GET_VOLUNTEER_CATEGORY_OF_TYPE = "GET_VOLUNTEER_CATEGORY_OF_TYPE";
export const GET_EVENT_DATES_START = "GET_EVENT_DATES_START";
export const GET_EVENT_DATES_SUCCESS = "GET_EVENT_DATES_SUCCESS";
export const GET_EVENT_DATES_FAIL = "GET_EVENT_DATES_FAIL";

export type GetVolunteerCategoriesTypesType =
    typeof GET_VOLUNTEER_CATEGORY_TYPES;
export type GetVolunteerCategoriesStartType =
    typeof GET_VOLUNTEER_CATEGORIES_START;
export type GetVolunteerCategoriesSuccessType =
    typeof GET_VOLUNTEER_CATEGORIES_SUCCESS;
export type GetVolunteerCategoriesFailType =
    typeof GET_VOLUNTEER_CATEGORIES_FAIL;
export type GetMappedVolunteerRolesStartType =
    typeof GET_MAPPED_VOLUNTEER_ROLES_START;
export type GetMappedVolunteerRolesSuccessType =
    typeof GET_MAPPED_VOLUNTEER_ROLES_SUCCESS;
export type GetMappedVolunteerRolesFailType =
    typeof GET_MAPPED_VOLUNTEER_ROLES_FAIL;
export type AcceptRequestStartType = typeof ACCEPT_REQUEST_START;
export type AcceptRequestSuccessType = typeof ACCEPT_REQUEST_SUCCESS;
export type AcceptRequestFailType = typeof ACCEPT_REQUEST_FAIL;
export type DenyRequestStartType = typeof DENY_REQUEST_START;
export type DenyRequestSuccessType = typeof DENY_REQUEST_SUCCESS;
export type DenyRequestFailType = typeof DENY_REQUEST_FAIL;
export type ChangeRequestRoleStartType = typeof CHANGE_REQUEST_ROLE_START;
export type ChangeRequestRoleSuccessType = typeof CHANGE_REQUEST_ROLE_SUCCESS;
export type ChangeRequestRoleFailType = typeof CHANGE_REQUEST_ROLE_FAIL;
export type GetVolunteerCategoriesOfTypeType =
    typeof GET_VOLUNTEER_CATEGORY_OF_TYPE;
export type GetEventDatesStartType = typeof GET_EVENT_DATES_START;
export type GetEventDatesSuccessType = typeof GET_EVENT_DATES_SUCCESS;
export type GetEventDatesFailType = typeof GET_EVENT_DATES_FAIL;
