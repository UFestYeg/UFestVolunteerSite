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
        default:
            return state;
    }
};
