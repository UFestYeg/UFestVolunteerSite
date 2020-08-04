import axios from "axios";
import { AuthUrls } from "../../constants";
import { DefaultUser, IUserProfile } from "../types";
import * as ActionTypes from "./actionTypes";

export type ActionType = {
    type: ActionTypes.GetUserProfileType;
    payload: IUserProfile;
};
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

// export function updateUserProfile(formValues, dispatch, props) {
//     const token = getUserToken(store.getState());

//     return axios
//         .patch(AuthUrls.USER_PROFILE, formValues, {
//             headers: {
//                 authorization: "Token " + token,
//             },
//         })
//         .then((response) => {
//             dispatch(
//                 notifSend({
//                     message: "Your profile has been updated successfully",
//                     kind: "info",
//                     dismissAfter: 5000,
//                 })
//             );

//             history.push("/profile");
//         })
//         .catch((error) => {
//             // If request is bad...
//             // Show an error to the user
//             const processedError = processServerError(error.response.data);
//             throw new SubmissionError(processedError);
//         });
// }
