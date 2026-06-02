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
            axios.defaults.headers.common["Authorization"] = `Token ${token}`;
            axios.defaults.headers.common["Content-Type"] =
                "application/json";
            axios.defaults.headers.common["X-CSRFToken"] = cookies;
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
                    enqueueSnackbar("Unable to get user profile.", {
                        variant: "error",
                    });
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
        axios.defaults.headers.common["Authorization"] = `Token ${token}`;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.defaults.headers.common["X-CSRFToken"] = cookies;
        axios
            .patch(AuthUrls.USER_PROFILE, formValues)
            .then((response) => {
                console.log(response);
                dispatch(updateProfileSuccess());
                enqueueSnackbar("Your profile was updated.", {
                    variant: "success",
                });
                navigate("/volunteer");
            })
            .catch((reqError) => {
                // If request is bad...
                // Show an error to the user
                dispatch(updateProfileFail(reqError));
                enqueueSnackbar(
                    "Unable to update profile. Please try again.",
                    { variant: "error" }
                );
            });
    };
};
