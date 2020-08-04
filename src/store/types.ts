import { TShirtSizeType } from "../types";
import { actionTypes } from "./actions";
import { AuthStateType, UserStateType } from "./reducers";

export type AuthActionType =
    | { type: actionTypes.StartType }
    | { type: actionTypes.EmailSentType }
    | { type: actionTypes.ActivationType }
    | { type: actionTypes.SuccessType; token: string }
    | { type: actionTypes.FailType; error: string }
    | { type: actionTypes.LogoutType }
    | { type: actionTypes.ResetPasswordStartType }
    | { type: actionTypes.ResetPasswordSuccessType }
    | { type: actionTypes.ResetPasswordEmailSentType }
    | { type: actionTypes.ResetPasswordFailType; error: string }
    | { type: actionTypes.ChangePasswordStartType }
    | { type: actionTypes.ChangePasswordSuccessType }
    | { type: actionTypes.ChangePasswordFailType; error: string };

export type UserActionType =
    | { type: actionTypes.GetUserProfileType; payload: IUserProfile }
    | { type: actionTypes.ClearUserProfileType }
    | { type: actionTypes.UpdateProfileStartType }
    | { type: actionTypes.UpdateProfileSuccessType }
    | { type: actionTypes.UpdateProfileFailType; error: string };

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
    comments: string;
    age: null | string;
    dietary_restrictions: string;
    emergency_contact: string;
    medical_restrictions: string;
    special_interests: string;
    over_eighteen: boolean;
    previous_volunteer: boolean;
    student_volunteer_hours: boolean;
    t_shirt_size: TShirtSizeType;
}

export const DefaultUser: IUserProfile = {
    pk: -1,
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    comments: "",
    age: null,
    dietary_restrictions: "",
    emergency_contact: "",
    medical_restrictions: "",
    special_interests: "",
    over_eighteen: false,
    previous_volunteer: false,
    student_volunteer_hours: false,
    t_shirt_size: "M",
};

export interface IProfileEditFormValues {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    comments: string;
    age: null | string;
    dietary_restrictions: string;
    emergency_contact: string;
    medical_restrictions: string;
    special_interests: string;
    over_eighteen: boolean;
    previous_volunteer: boolean;
    student_volunteer_hours: boolean;
    t_shirt_size: TShirtSizeType;
}
