import { actionTypes } from "../actions";
import { DefaultUser, IUserProfile } from "../types";
import { updateObject } from "../utils";

export interface IUserProfileState {
    profile: IUserProfile;
    error: any | null;
    loading: boolean;
}

const initialState: IUserProfileState = {
    error: null,
    loading: false,
    profile: DefaultUser,
};

const userGetProfile = (state: IUserProfileState, action: any) => {
    return updateObject(state, {
        profile: action.payload,
    });
};

const updateProfileStart = (state: IUserProfileState, action: any) => {
    return updateObject(state, {
        error: null,
        loading: true,
    });
};

const updateProfileSuccess = (state: IUserProfileState, action: any) => {
    return updateObject(state, {
        error: null,
        loading: false,
    });
};

const updateProfileFail = (state: IUserProfileState, action: any) => {
    return updateObject(state, {
        error: action.error,
        loading: false,
    });
};

export const reducer = (state = initialState, action: any) => {
    switch (action.type) {
        case actionTypes.USER_GET_PROFILE:
            return userGetProfile(state, action);
        case actionTypes.UPDATE_PROFILE_START:
            return updateProfileStart(state, action);
        case actionTypes.UPDATE_PROFILE_SUCCESS:
            return updateProfileSuccess(state, action);
        case actionTypes.UPDATE_PROFILE_FAIL:
            return updateProfileFail(state, action);
        default:
            return state;
    }
};
