import { actionTypes } from "../actions";
import { updateObject } from "../utils";

export interface IAuthState {
    token: string | null;
    error: any | null;
    loading: boolean;
}

const initialState: IAuthState = {
    error: null,
    loading: false,
    token: null,
};

const authStart = (state: IAuthState, action: any) => {
    return updateObject(state, {
        error: null,
        loading: true,
    });
};

const authSuccess = (state: IAuthState, action: any) => {
    return updateObject(state, {
        error: null,
        loading: false,
        token: action.token,
    });
};

const authFail = (state: IAuthState, action: any) => {
    return updateObject(state, {
        error: action.error,
        loading: false,
    });
};

const authLogout = (state: IAuthState, action: any) => {
    return updateObject(state, {
        token: null,
    });
};

const resetPasswordStart = (state: IAuthState, action: any) => {
    return updateObject(state, {
        error: null,
        loading: true,
    });
};

const resetPasswordSuccess = (state: IAuthState, action: any) => {
    return updateObject(state, {
        error: null,
        loading: false,
    });
};

const resetPasswordEmailSent = (state: IAuthState, action: any) => {
    return updateObject(state, {
        error: null,
        loading: false,
    });
};

const resetPasswordFail = (state: IAuthState, action: any) => {
    return updateObject(state, {
        error: action.error,
        loading: false,
    });
};

const changePasswordStart = (state: IAuthState, action: any) => {
    return updateObject(state, {
        error: null,
        loading: true,
    });
};

const changePasswordSuccess = (state: IAuthState, action: any) => {
    return updateObject(state, {
        error: null,
        loading: false,
    });
};

const changePasswordFail = (state: IAuthState, action: any) => {
    return updateObject(state, {
        error: action.error,
        loading: false,
    });
};

export const reducer = (state = initialState, action: any) => {
    switch (action.type) {
        case actionTypes.AUTH_START:
            return authStart(state, action);
        case actionTypes.AUTH_SUCCESS:
            return authSuccess(state, action);
        case actionTypes.AUTH_FAIL:
            return authFail(state, action);
        case actionTypes.AUTH_LOGOUT:
            return authLogout(state, action);
        case actionTypes.RESET_PASSWORD_START:
            return resetPasswordStart(state, action);
        case actionTypes.RESET_PASSWORD_SUCCESS:
            return resetPasswordSuccess(state, action);
        case actionTypes.RESET_PASSWORD_EMAIL_SENT:
            return resetPasswordEmailSent(state, action);
        case actionTypes.RESET_PASSWORD_FAIL:
            return resetPasswordFail(state, action);
        case actionTypes.CHANGE_PASSWORD_START:
            return changePasswordStart(state, action);
        case actionTypes.CHANGE_PASSWORD_SUCCESS:
            return changePasswordSuccess(state, action);
        case actionTypes.CHANGE_PASSWORD_FAIL:
            return changePasswordFail(state, action);
        default:
            return state;
    }
};
