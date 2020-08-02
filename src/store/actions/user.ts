import axios from "axios";
import * as actionTypes from "./actionTypes";
import { authCheckState } from "./auth";
import { StateHooks } from "../hooks";

type ActionType = { type: actionTypes.UserProfileType; token: string };
type DispatchType = (action: ActionType) => void;

function setUserProfile(payload) {
    return {
        type: actionTypes.USER_PROFILE,
        payload: payload,
    };
}

export function getUserProfile() {
    return function (dispatch: DispatchType) {
        const token = useToken();
        if (token) {
            axios
                .get(AuthUrls.USER_PROFILE, {
                    headers: {
                        authorization: "Token " + token,
                    },
                })
                .then((response) => {
                    dispatch(setUserProfile(response.data));
                })
                .catch((error) => {
                    // If request is bad...
                    // Show an error to the user
                    console.log(error);
                    // TODO: send notification and redirect
                });
        }
    };
}
