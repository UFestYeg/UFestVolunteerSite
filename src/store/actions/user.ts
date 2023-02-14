import axios from "axios";
import { Notification } from "react-notification-system";
import { error, success } from "react-notification-system-redux";
import { AuthUrls, UserUrls } from "../../constants";
import history from "../../history";
import { IProfileEditFormValues } from "../../store/types";
import {
    DefaultUser,
    IUserProfile,
    UserActionType as ActionType,
} from "../types";
import * as ActionTypes from "./actionTypes";

type DispatchType = (action: ActionType) => void;

export const getUserProfileStart = (): ActionType => {
    return {
        type: ActionTypes.USER_GET_PROFILE_START,
    };
};

export const getUserProfileSucces = (payload: IUserProfile): ActionType => {
    return {
        payload,
        type: ActionTypes.USER_GET_PROFILE_SUCCESS,
    };
};

export const getViewedUserProfileSucces = (
    payload: IUserProfile
): ActionType => {
    return {
        payload,
        type: ActionTypes.USER_GET_VIEWED_PROFILE_SUCCESS,
    };
};

export const getUserProfileFail = (reqError: any): ActionType => {
    return {
        error: reqError,
        type: ActionTypes.USER_GET_PROFILE_FAIL,
    };
};

export const clearUserProfile = (payload: any): ActionType => {
    return {
        payload: DefaultUser,
        type: ActionTypes.USER_GET_PROFILE_SUCCESS,
    };
};

export const updateProfileStart = (): ActionType => {
    return {
        type: ActionTypes.UPDATE_PROFILE_START,
    };
};

export const updateProfileSuccess = (): ActionType => {
    return {
        type: ActionTypes.UPDATE_PROFILE_SUCCESS,
    };
};

export const updateProfileFail = (reqError: any): ActionType => {
    return {
        error: reqError,
        type: ActionTypes.UPDATE_PROFILE_FAIL,
    };
};

export const getUserProfile = (cookies: any, userID?: number) => {
    const token = localStorage.getItem("token");
    return (dispatch: DispatchType) => {
        if (token) {
            dispatch(getUserProfileStart());
            const userProfileUrl = userID
                ? UserUrls.USER_PROFILE_DETAILS(userID)
                : AuthUrls.USER_PROFILE;
            axios.defaults.headers = {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
                "X-CSRFToken": cookies,
            };
            axios
                .get(userProfileUrl)
                .then((response) => {
                    console.log(response.data);
                    userID
                        ? dispatch(getViewedUserProfileSucces(response.data))
                        : dispatch(getUserProfileSucces(response.data));
                })
                .catch((reqError) => {
                    // If request is bad...
                    // Show an error to the user
                    console.error(reqError);
                    dispatch(getUserProfileFail(reqError));
                    // TODO: send notification and redirect
                    const notificationOpts: Notification = {
                        title: "Oops, something went wrong!",
                        message: "Unable to get user profile.",
                        position: "tr",
                        autoDismiss: 5,
                    };
                    dispatch(error(notificationOpts));
                });
        } else {
            console.log("Unable to get user without token");
        }
    };
};

export const updateUserProfile = (
    formValues: IProfileEditFormValues,
    cookies: any
) => {
    const token = localStorage.getItem("token");

    return (dispatch: DispatchType) => {
        dispatch(updateProfileStart());
        axios.defaults.headers = {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
            "X-CSRFToken": cookies,
        };
        axios
            .patch(AuthUrls.USER_PROFILE, formValues)
            .then((response) => {
                console.log(response);
                const notificationOpts: Notification = {
                    title: "Success!",
                    message: "Your profile was updated.",
                    position: "tr",
                    autoDismiss: 5,
                };
                dispatch(updateProfileSuccess());
                dispatch(success(notificationOpts));
                history.push("/volunteer");
            })
            .catch((reqError) => {
                // If request is bad...
                // Show an error to the user
                dispatch(updateProfileFail(reqError));
                const notificationOpts: Notification = {
                    title: "Oops, something went wrong!",
                    message: "Unable to update profile. Please try again.",
                    position: "tr",
                    autoDismiss: 5,
                };
                dispatch(error(notificationOpts));
            });
    };
};
