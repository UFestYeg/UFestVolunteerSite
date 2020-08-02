import { actionTypes } from "../actions";
import { DefaultUser, IUserProfile } from "../types";
import { updateObject } from "../utils";

export interface IUserProfileState {
    payload: IUserProfile;
}

const initialState: IUserProfileState = {
    payload: DefaultUser,
};

const userGetProfile = (state: IUserProfileState, action: any) => {
    return updateObject(state, {
        payload: action.payload,
    });
};

export const reducer = (state = initialState, action: any) => {
    switch (action.type) {
        case actionTypes.USER_GET_PROFILE:
            return userGetProfile(state, action);
        default:
            return state;
    }
};
