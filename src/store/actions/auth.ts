import axios from "axios";
import { AuthUrls } from "../../constants";
import history from "../../history";
import { AuthActionType as ActionType } from "../types";
import * as actionTypes from "./actionTypes";
import { success } from "react-notification-system-redux";
import { Notification } from "react-notification-system";

type DispatchType = (action: ActionType) => void;

const SECOND_IN_HOUR = 3600;
const MILLISECONDS_IN_SECOND = 1000;

export const authStart = (): ActionType => {
    return {
        type: actionTypes.AUTH_START,
    };
};

export const authEmailSent = (): ActionType => {
    return {
        type: actionTypes.AUTH_EMAIL_SENT,
    };
};

export const authActivationSent = (): ActionType => {
    return {
        type: actionTypes.AUTH_ACTIVATION,
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

export const resetPasswordEmailSent = (): ActionType => {
    return {
        type: actionTypes.RESET_PASSWORD_EMAIL_SENT,
    };
};

export const resetPasswordFail = (error: any): ActionType => {
    return {
        error,
        type: actionTypes.RESET_PASSWORD_FAIL,
    };
};

export const changePasswordStart = (): ActionType => {
    return {
        type: actionTypes.CHANGE_PASSWORD_START,
    };
};

export const changePasswordSuccess = (): ActionType => {
    return {
        type: actionTypes.CHANGE_PASSWORD_SUCCESS,
    };
};

export const changePasswordFail = (error: any): ActionType => {
    return {
        error,
        type: actionTypes.CHANGE_PASSWORD_FAIL,
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

export const authLogin = (
    username: string,
    password: string,
    csrftoken: string
) => {
    return (dispatch: DispatchType) => {
        dispatch(authStart());
        axios.defaults.headers = {
            "X-CSRFToken": csrftoken,
        };
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
    password2: string,
    csrftoken: string
) => {
    return (dispatch: DispatchType) => {
        dispatch(authStart());
        axios.defaults.headers = {
            "X-CSRFToken": csrftoken,
        };
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
                console.log(res);
                dispatch(authEmailSent());
                history.push("/signup_done");
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

export const changePassword = (
    oldPassword: string,
    newPassword1: string,
    newPassword2: string,
    csrftoken: string
) => {
    const token = localStorage.getItem("token");
    if (token) {
        axios.defaults.headers = {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
        };
        return (dispatch: DispatchType) => {
            axios
                .post(AuthUrls.CHANGE_PASSWORD, {
                    old_password: oldPassword,
                    new_password1: newPassword1,
                    new_password2: newPassword2,
                })
                .then((response) => {
                    console.log(response);
                    const notificationOpts: Notification = {
                        title: "Hey, it's good to see you!",
                        message:
                            "Now you can see how easy it is to use notifications in React!",
                        position: "tr",
                        autoDismiss: 0,
                        action: {
                            label: "Click me!!",
                            callback: () => alert("clicked!"),
                        },
                    };
                    dispatch(success(notificationOpts));
                    // redirect to the route '/profile'
                    dispatch(changePasswordSuccess());
                    dispatch(logout());
                })
                .catch((error) => {
                    // If request is bad...
                    // Show an error to the user
                    dispatch(changePasswordFail(error));
                });
        };
    }
};

export const resetPassword = (email: string, csrftoken: string) => {
    return (dispatch: DispatchType) => {
        dispatch(resetPasswordStart());
        axios.defaults.headers = {
            "X-CSRFToken": csrftoken,
        };
        axios
            .post(AuthUrls.RESET_PASSWORD, { email })
            .then((response) => {
                // redirect to reset done page
                console.log(response);
                dispatch(resetPasswordEmailSent());
                history.push("/reset_password_done");
            })
            .catch((error) => {
                // If request is bad...
                // Show an error to the user
                dispatch(resetPasswordFail(error));
            });
    };
};

export const confirmPasswordChange = (
    uid: string,
    token: string,
    password: string,
    confirmPassword: string,
    csrftoken: string
) => {
    return (dispatch: DispatchType) => {
        axios.defaults.headers = {
            "X-CSRFToken": csrftoken,
        };
        axios
            .post(AuthUrls.RESET_PASSWORD_CONFIRM, {
                uid,
                token,
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
                dispatch(resetPasswordSuccess());
                history.push("/login");
            })
            .catch((error) => {
                // If request is bad...
                // Show an error to the user
                dispatch(resetPasswordFail(error));
            });
    };
};

export const activateUserAccount = (key: string, csrftoken: string) => {
    return (dispatch: DispatchType) => {
        axios.defaults.headers = {
            "X-CSRFToken": csrftoken,
        };
        axios
            .post(AuthUrls.USER_ACTIVATION, { key })
            .then((response) => {
                console.log(response);
                // dispatch(notifSend({
                //     message: "Your account has been activated successfully, please log in",
                //     kind: "info",
                //     dismissAfter: 5000
                // }));
                dispatch(authActivationSent());
                history.push("/login");
            })
            .catch((error) => {
                // If request is bad...
                // Show an error to the user
                dispatch(authFail(error));
            });
    };
};
