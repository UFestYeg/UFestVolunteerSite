import axios from "axios";
import { AuthUrls } from "../../constants";
import history from "../../history";
import { IProfileEditFormValues } from "../../store/types";
import {
    DefaultUser,
    IUserProfile,
    UserActionType as ActionType,
} from "../types";
import * as ActionTypes from "./actionTypes";

type DispatchType = (action: ActionType) => void;

export const setUserProfile = (payload: IUserProfile): ActionType => {
    return {
        type: ActionTypes.USER_GET_PROFILE,
        payload,
    };
};

export const clearUserProfile = (payload: any): ActionType => {
    return {
        type: ActionTypes.USER_GET_PROFILE,
        payload: DefaultUser,
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

export const getUserProfile = () => {
    const token = localStorage.getItem("token");
    return (dispatch: DispatchType) => {
        if (token) {
            axios.defaults.headers = {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            };
            axios
                .get(AuthUrls.USER_PROFILE)
                .then((response) => {
                    console.log(response.data);
                    dispatch(setUserProfile(response.data));
                })
                .catch((error) => {
                    // If request is bad...
                    // Show an error to the user
                    console.error(error);
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

                // dispatch(
                //     notifSend({
                //         message: "Your profile has been updated successfully",
                //         kind: "info",
                //         dismissAfter: 5000,
                //     })
                // );
                dispatch(updateProfileSuccess());
                history.push("/volunteer/profile");
            })
            .catch((error) => {
                // If request is bad...
                // Show an error to the user
                dispatch(updateProfileFail(error));
            });
    };
};
