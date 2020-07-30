import axios from "axios";
import { AuthUrls } from "../../constants";
import history from "../../history";
import * as actionTypes from "./actionTypes";

type ActionType =
    | { type: actionTypes.StartType }
    | { type: actionTypes.SuccessType; token: string }
    | { type: actionTypes.FailType; error: string }
    | { type: actionTypes.LogoutType }
    | { type: actionTypes.ResetPasswordStartType }
    | { type: actionTypes.ResetPasswordSuccessType }
    | { type: actionTypes.ResetPasswordFailType; error: string };
type DispatchType = (action: ActionType) => void;

const SECOND_IN_HOUR = 3600;
const MILLISECONDS_IN_SECOND = 1000;

export const authStart = (): ActionType => {
    return {
        type: actionTypes.AUTH_START,
    };
};

export const authSuccess = (token: string): ActionType => {
    return {
        token,
        type: actionTypes.AUTH_SUCCESS,
    };
};

export const authFail = (error: any): ActionType => {
    return {
        error,
        type: actionTypes.AUTH_FAIL,
    };
};

export const resetPasswordStart = (): ActionType => {
    return {
        type: actionTypes.RESET_PASSWORD_START,
    };
};

export const resetPasswordSuccess = (): ActionType => {
    return {
        type: actionTypes.RESET_PASSWORD_SUCCESS,
    };
};

export const resetPasswordFail = (error: any): ActionType => {
    return {
        error,
        type: actionTypes.RESET_PASSWORD_FAIL,
    };
};

export const logout = (): ActionType => {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    return {
        type: actionTypes.AUTH_LOGOUT,
    };
};

export const checkAuthTimeout = (expirationTime: number) => {
    return (dispatch: DispatchType) => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * MILLISECONDS_IN_SECOND);
    };
};

export const authLogin = (username: string, password: string) => {
    return (dispatch: DispatchType) => {
        dispatch(authStart());
        axios
            .post(AuthUrls.LOGIN, {
                password,
                username,
            })
            .then((res) => {
                const token = res.data.key;
                const expirationDate = new Date(
                    new Date().getTime() +
                        SECOND_IN_HOUR * MILLISECONDS_IN_SECOND
                );
                localStorage.setItem("token", token);
                localStorage.setItem(
                    "expirationDate",
                    expirationDate.toISOString()
                );
                dispatch(authSuccess(token));
                checkAuthTimeout(SECOND_IN_HOUR)(dispatch);
            })
            .catch((err) => {
                dispatch(authFail(err));
            });
    };
};

export const authSignup = (
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password1: string,
    password2: string
) => {
    return (dispatch: DispatchType) => {
        dispatch(authStart());
        axios
            .post(AuthUrls.SIGNUP, {
                first_name: firstName,
                last_name: lastName,
                email,
                password1,
                password2,
                username,
            })
            .then((res) => {
                const token = res.data.key;
                const expirationDate = new Date(
                    new Date().getTime() +
                        SECOND_IN_HOUR * MILLISECONDS_IN_SECOND
                );
                localStorage.setItem("token", token);
                localStorage.setItem(
                    "expirationDate",
                    expirationDate.toISOString()
                );
                dispatch(authSuccess(token));
                checkAuthTimeout(SECOND_IN_HOUR)(dispatch);
            })
            .catch((err) => {
                dispatch(authFail(err));
            });
    };
};

export const authCheckState = () => {
    return (dispatch: DispatchType) => {
        const token = localStorage.getItem("token");
        const expirationDateString = localStorage.getItem("expirationDate");
        if (
            token === undefined ||
            token === null ||
            expirationDateString === null
        ) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(expirationDateString);
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                dispatch(authSuccess(token));
                checkAuthTimeout(
                    (expirationDate.getTime() - new Date().getTime()) /
                        MILLISECONDS_IN_SECOND
                )(dispatch);
            }
        }
    };
};

// export function changePassword(formValues, dispatch, props) {
//     const token = localStorage.getItem("token");
//     if (token) {
//         axios.defaults.headers = {
//             Authorization: token,
//             "Content-Type": "application/json",
//         };
//         return axios
//             .post(AuthUrls.CHANGE_PASSWORD, formValues)
//             .then((response) => {
//                 dispatch(
//                     notifSend({
//                         message: "Password has been changed successfully",
//                         kind: "info",
//                         dismissAfter: 5000,
//                     })
//                 );
//                 // redirect to the route '/profile'
//                 history.push("/profile");
//             })
//             .catch((error) => {
//                 // If request is bad...
//                 // Show an error to the user
//                 const processedError = processServerError(error.response.data);
//                 throw new SubmissionError(processedError);
//             });
//     }
// }

export function resetPassword(email: string) {
    return (dispatch: DispatchType) => {
        axios
            .post(AuthUrls.RESET_PASSWORD, { email })
            .then((response) => {
                // redirect to reset done page
                console.log(response);
                dispatch(resetPasswordSuccess());
                history.push("/reset_password_done");
            })
            .catch((error) => {
                // If request is bad...
                // Show an error to the user
                dispatch(resetPasswordFail(error));
            });
    };
}

export function confirmPasswordChange(
    password: string,
    confirmPassword: string
) {
    return (dispatch: DispatchType) => {
        axios
            .post(AuthUrls.RESET_PASSWORD_CONFIRM, {
                new_password1: password,
                new_password2: confirmPassword,
            })
            .then((response) => {
                console.log(response);
                // dispatch(
                //     notifSend({
                //         message:
                //             "Password has been reset successfully, please log in",
                //         kind: "info",
                //         dismissAfter: 5000,
                //     })
                // );

                history.push("/login");
            })
            .catch((error) => {
                // If request is bad...
                // Show an error to the user
                dispatch(resetPasswordFail(error));
            });
    };
}
