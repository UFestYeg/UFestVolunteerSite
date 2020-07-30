import { actionTypes } from "./actions";
import { AuthStateType, UserStateType } from "./reducers";

export type AuthActionType =
    | { type: actionTypes.StartType }
    | { type: actionTypes.SuccessType; token: string }
    | { type: actionTypes.FailType; error: string }
    | { type: actionTypes.LogoutType }
    | { type: actionTypes.ResetPasswordStartType }
    | { type: actionTypes.ResetPasswordSuccessType }
    | { type: actionTypes.ResetPasswordFailType; error: string };

export interface State {
    auth: AuthStateType;
    user: UserStateType;
}

export interface IUserProfile {
    pk: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

export const DefaultUser = {
    pk: -1,
    username: "",
    email: "",
    first_name: "",
    last_name: "",
};
