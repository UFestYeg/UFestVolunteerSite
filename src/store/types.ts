import { AuthStateType, UserStateType } from "./reducers";

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
