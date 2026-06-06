import { AnyAction } from "redux";
import { actionTypes } from "../actions";
import { AuthActionType } from "../types";
import { updateObject } from "../utils";

// Narrows the AuthActionType union to the single member with the given `type`,
// so each reducer helper can be typed to exactly the action it handles.
type AAction<T extends AuthActionType["type"]> = Extract<
    AuthActionType,
    { type: T }
>;

export interface IAuthState {
    token: string | null;
    error: string | null;
    loading: boolean;
}

const initialState: IAuthState = {
    error: null,
    loading: false,
    token: null,
};

const authStart = (state: IAuthState) => {
    return updateObject(state, {
        error: null,
        loading: true,
    });
};

const authEmailSent = (state: IAuthState) => {
    return updateObject(state, {
        error: null,
        loading: false,
    });
};

const authActivation = (state: IAuthState) => {
    return updateObject(state, {
        error: null,
        loading: false,
    });
};

const authSuccess = (
    state: IAuthState,
    action: AAction<typeof actionTypes.AUTH_SUCCESS>
) => {
    return updateObject(state, {
        error: null,
        loading: false,
        token: action.token,
    });
};

const authFail = (
    state: IAuthState,
    action: AAction<typeof actionTypes.AUTH_FAIL>
) => {
    return updateObject(state, {
        error: action.error,
        loading: false,
    });
};

const authLogout = (state: IAuthState) => {
    return updateObject(state, {
        token: null,
    });
};

const resetPasswordStart = (state: IAuthState) => {
    return updateObject(state, {
        error: null,
        loading: true,
    });
};

const resetPasswordSuccess = (state: IAuthState) => {
    return updateObject(state, {
        error: null,
        loading: false,
    });
};

const resetPasswordEmailSent = (state: IAuthState) => {
    return updateObject(state, {
        error: null,
        loading: false,
    });
};

const resetPasswordFail = (
    state: IAuthState,
    action: AAction<typeof actionTypes.RESET_PASSWORD_FAIL>
) => {
    return updateObject(state, {
        error: action.error,
        loading: false,
    });
};

const changePasswordStart = (state: IAuthState) => {
    return updateObject(state, {
        error: null,
        loading: true,
    });
};

const changePasswordSuccess = (state: IAuthState) => {
    return updateObject(state, {
        error: null,
        loading: false,
    });
};

const changePasswordFail = (
    state: IAuthState,
    action: AAction<typeof actionTypes.CHANGE_PASSWORD_FAIL>
) => {
    return updateObject(state, {
        error: action.error,
        loading: false,
    });
};

export const reducer = (state = initialState, incomingAction: AnyAction) => {
    const action = incomingAction as AuthActionType;
    switch (action.type) {
        case actionTypes.AUTH_START:
            return authStart(state);
        case actionTypes.AUTH_EMAIL_SENT:
            return authEmailSent(state);
        case actionTypes.AUTH_ACTIVATION:
            return authActivation(state);
        case actionTypes.AUTH_SUCCESS:
            return authSuccess(state, action);
        case actionTypes.AUTH_FAIL:
            return authFail(state, action);
        case actionTypes.AUTH_LOGOUT:
            return authLogout(state);
        case actionTypes.RESET_PASSWORD_START:
            return resetPasswordStart(state);
        case actionTypes.RESET_PASSWORD_SUCCESS:
            return resetPasswordSuccess(state);
        case actionTypes.RESET_PASSWORD_EMAIL_SENT:
            return resetPasswordEmailSent(state);
        case actionTypes.RESET_PASSWORD_FAIL:
            return resetPasswordFail(state, action);
        case actionTypes.CHANGE_PASSWORD_START:
            return changePasswordStart(state);
        case actionTypes.CHANGE_PASSWORD_SUCCESS:
            return changePasswordSuccess(state);
        case actionTypes.CHANGE_PASSWORD_FAIL:
            return changePasswordFail(state, action);
        default:
            return state;
    }
};
