import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { AuthUrls } from "../../constants";
import { navigate } from "../../navigation";
import { setAuthHeaders } from "./apiUtils";
import { AuthActionType as ActionType } from "../types";
import * as actionTypes from "./actionTypes";

type DispatchType = (action: ActionType) => void;

const SECOND_IN_HOUR = 3600;
const MILLISECONDS_IN_SECOND = 1000;

// Remove the locally cached credentials and stop sending the stale token on
// subsequent requests. Centralized so both the explicit logout and the
// 401-driven session expiry clear exactly the same state.
const clearStoredCredentials = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    delete axios.defaults.headers.common["Authorization"];
};

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
    // Best-effort server-side revocation: POST to dj-rest-auth's logout
    // endpoint so the user's DRF token is deleted in the database, not just
    // forgotten locally. The token in the Authorization header (set by
    // setAuthHeaders) identifies which token to revoke, so no cookies are
    // needed. Fire-and-forget — the local sign-out below must succeed
    // regardless of the network result, and we skip the call entirely for
    // anonymous app loads (no token).
    const token = localStorage.getItem("token");
    if (token) {
        axios.post(AuthUrls.LOGOUT, {}).catch(() => {
            // Ignore: the user is signed out locally either way.
        });
    }
    clearStoredCredentials();
    return {
        type: actionTypes.AUTH_LOGOUT,
    };
};

// Local-only sign-out used when the backend has already rejected our token
// (HTTP 401 from the response interceptor). Skips the network logout: the
// token is already invalid server-side, so there is nothing to revoke, and
// calling the logout endpoint with a dead token would just 401 again.
export const sessionExpired = (): ActionType => {
    clearStoredCredentials();
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
        axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
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
        axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
        axios
            .post(AuthUrls.SIGNUP, {
                first_name: firstName,
                last_name: lastName,
                email,
                password1,
                password2,
                username,
            })
            .then(() => {
                dispatch(authEmailSent());
                navigate("/signup_done");
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
    return (dispatch: DispatchType) => {
        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }
        setAuthHeaders(token, csrftoken);
        axios
            .post(AuthUrls.CHANGE_PASSWORD, {
                old_password: oldPassword,
                new_password1: newPassword1,
                new_password2: newPassword2,
            })
            .then(() => {
                // redirect to the route '/profile'
                dispatch(changePasswordSuccess());
                enqueueSnackbar("Your password was changed.", {
                    variant: "success",
                });
                dispatch(logout());
            })
            .catch((reqError) => {
                // If request is bad...
                // Show an error to the user
                dispatch(changePasswordFail(reqError));
                enqueueSnackbar(
                    "Unable to change password. Please try again.",
                    { variant: "error" }
                );
            });
    };
};

export const resetPassword = (email: string, csrftoken: string) => {
    return (dispatch: DispatchType) => {
        dispatch(resetPasswordStart());
        axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
        axios
            .post(AuthUrls.RESET_PASSWORD, { email })
            .then(() => {
                // redirect to reset done page
                dispatch(resetPasswordEmailSent());
                enqueueSnackbar("Password reset email sent.", {
                    variant: "success",
                });
                navigate("/reset_password_done");
            })
            .catch((reqError) => {
                // If request is bad...
                // Show an error to the user
                dispatch(resetPasswordFail(reqError));
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
        axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
        axios
            .post(AuthUrls.RESET_PASSWORD_CONFIRM, {
                uid,
                token,
                new_password1: password,
                new_password2: confirmPassword,
            })
            .then(() => {
                dispatch(resetPasswordSuccess());
                enqueueSnackbar("Your password has been reset, please log in.", {
                    variant: "success",
                });
                navigate("/login");
            })
            .catch((reqError) => {
                // If request is bad...
                // Show an error to the user
                dispatch(resetPasswordFail(reqError));
            });
    };
};

export const activateUserAccount = (key: string, csrftoken: string) => {
    return (dispatch: DispatchType) => {
        axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
        axios
            .post(AuthUrls.USER_ACTIVATION, { key })
            .then(() => {
                dispatch(authActivationSent());
                enqueueSnackbar(
                    "Your account has been activated successfully, please log in.",
                    { variant: "success" }
                );
                navigate("/login");
            })
            .catch((reqError) => {
                // If request is bad...
                // Show an error to the user
                dispatch(authFail(reqError));
            });
    };
};
