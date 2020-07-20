import axios from "axios";
import * as actionTypes from "./actionTypes";

type ActionType =
    | { type: actionTypes.StartType }
    | { type: actionTypes.SuccessType; token: string }
    | { type: actionTypes.FailType; error: string }
    | { type: actionTypes.LogoutType };
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

export const logout = (): ActionType => {
    localStorage.removeItem("user");
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
            .post(`${process.env["REACT_APP_API_URI"]}rest-auth/login/`, {
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
    username: string,
    email: string,
    password1: string,
    password2: string
) => {
    return (dispatch: DispatchType) => {
        dispatch(authStart());
        axios
            .post(
                `${process.env["REACT_APP_API_URI"]}rest-auth/registration/`,
                {
                    email,
                    password1,
                    password2,
                    username,
                }
            )
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
