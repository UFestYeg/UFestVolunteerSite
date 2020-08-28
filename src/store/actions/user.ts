import axios from "axios";
import { AuthUrls, UserUrls } from "../../constants";
import history from "../../history";
import { IProfileEditFormValues } from "../../store/types";
import {
    DefaultUser,
    IUserProfile,
    UserActionType as ActionType,
} from "../types";
import * as ActionTypes from "./actionTypes";
import { success } from "react-notification-system-redux";
import { Notification } from "react-notification-system";

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

export const getUserProfileFail = (error: any): ActionType => {
    return {
        error,
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

export const updateProfileFail = (error: any): ActionType => {
    return {
        error,
        type: ActionTypes.UPDATE_PROFILE_FAIL,
    };
};

export const getUserProfile = (userID?: number) => {
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
            };
            axios
                .get(userProfileUrl)
                .then((response) => {
                    console.log(response.data);
                    userID
                        ? dispatch(getViewedUserProfileSucces(response.data))
                        : dispatch(getUserProfileSucces(response.data));
                })
                .catch((error) => {
                    // If request is bad...
                    // Show an error to the user
                    console.error(error);
                    dispatch(getUserProfileFail(error));
                    // TODO: send notification and redirect
                });
        } else {
            console.log("Unable to get user without token");
        }
    };
};

export const updateUserProfile = (formValues: IProfileEditFormValues) => {
    const token = localStorage.getItem("token");

    return (dispatch: DispatchType) => {
        dispatch(updateProfileStart());
        axios.defaults.headers = {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
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
                history.push("/volunteer/profile/info");
            })
            .catch((error) => {
                // If request is bad...
                // Show an error to the user
                dispatch(updateProfileFail(error));
            });
    };
};
