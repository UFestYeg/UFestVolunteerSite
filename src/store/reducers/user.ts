import { AnyAction } from "redux";
import { actionTypes } from "../actions";
import { DefaultUser, IUserProfile, UserActionType } from "../types";
import { updateObject } from "../utils";

// Narrows the UserActionType union to the single member with the given `type`,
// so each reducer helper can be typed to exactly the action it handles.
type UAction<T extends UserActionType["type"]> = Extract<
    UserActionType,
    { type: T }
>;

export interface IUserProfileState {
    currentProfile: IUserProfile;
    viewedProfile: IUserProfile;
    error: string | null;
    loading: boolean;
}

const initialState: IUserProfileState = {
    error: null,
    loading: false,
    currentProfile: DefaultUser,
    viewedProfile: DefaultUser,
};

const userGetProfileStart = (state: IUserProfileState) => {
    return updateObject(state, {
        error: null,
        loading: true,
    });
};

const userGetProfileSuccess = (
    state: IUserProfileState,
    action: UAction<typeof actionTypes.USER_GET_PROFILE_SUCCESS>
) => {
    return updateObject(state, {
        error: null,
        loading: false,
        currentProfile: action.payload,
    });
};
const userGetViewedProfileSuccess = (
    state: IUserProfileState,
    action: UAction<typeof actionTypes.USER_GET_VIEWED_PROFILE_SUCCESS>
) => {
    return updateObject(state, {
        error: null,
        loading: false,
        viewedProfile: action.payload,
    });
};

const userGetProfileFail = (
    state: IUserProfileState,
    action: UAction<typeof actionTypes.USER_GET_PROFILE_FAIL>
) => {
    return updateObject(state, {
        error: action.error,
        loading: false,
    });
};

const updateProfileStart = (state: IUserProfileState) => {
    return updateObject(state, {
        error: null,
        loading: true,
    });
};

const updateProfileSuccess = (state: IUserProfileState) => {
    return updateObject(state, {
        error: null,
        loading: false,
    });
};

const updateProfileFail = (
    state: IUserProfileState,
    action: UAction<typeof actionTypes.UPDATE_PROFILE_FAIL>
) => {
    return updateObject(state, {
        error: action.error,
        loading: false,
    });
};

export const reducer = (state = initialState, incomingAction: AnyAction) => {
    const action = incomingAction as UserActionType;
    switch (action.type) {
        case actionTypes.USER_GET_PROFILE_START:
            return userGetProfileStart(state);
        case actionTypes.USER_GET_PROFILE_SUCCESS:
            return userGetProfileSuccess(state, action);
        case actionTypes.USER_GET_VIEWED_PROFILE_SUCCESS:
            return userGetViewedProfileSuccess(state, action);
        case actionTypes.USER_GET_PROFILE_FAIL:
            return userGetProfileFail(state, action);
        case actionTypes.UPDATE_PROFILE_START:
            return updateProfileStart(state);
        case actionTypes.UPDATE_PROFILE_SUCCESS:
            return updateProfileSuccess(state);
        case actionTypes.UPDATE_PROFILE_FAIL:
            return updateProfileFail(state, action);
        default:
            return state;
    }
};
