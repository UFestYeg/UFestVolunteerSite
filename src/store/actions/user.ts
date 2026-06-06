import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { AuthUrls, UserUrls } from "../../constants";
import { navigate } from "../../navigation";
import { IProfileEditFormValues } from "../../store/types";
import {
    DefaultUser,
    IUserProfile,
    UserActionType as ActionType,
} from "../types";
import * as ActionTypes from "./actionTypes";
import { logDev, notifyApiError, setAuthHeaders } from "./apiUtils";

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
            setAuthHeaders(token, cookies);
            axios
                .get(userProfileUrl)
                .then((response) => {
                    userID
                        ? dispatch(getViewedUserProfileSucces(response.data))
                        : dispatch(getUserProfileSucces(response.data));
                })
                .catch((reqError) => {
                    dispatch(getUserProfileFail(reqError));
                    notifyApiError(reqError, "Unable to get user profile.");
                });
        } else {
            logDev("Unable to get user without token");
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
        setAuthHeaders(token, cookies);
        axios
            .patch(AuthUrls.USER_PROFILE, formValues)
            .then(() => {
                dispatch(updateProfileSuccess());
                enqueueSnackbar("Your profile was updated.", {
                    variant: "success",
                });
                navigate("/volunteer");
            })
            .catch((reqError) => {
                dispatch(updateProfileFail(reqError));
                notifyApiError(
                    reqError,
                    "Unable to update profile. Please try again."
                );
            });
    };
};
