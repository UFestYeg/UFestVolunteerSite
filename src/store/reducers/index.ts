import { IAuthState, reducer as authReducer } from "./auth";
import { IUserProfileState, reducer as userReducer } from "./user";

export { authReducer, userReducer };
export type AuthStateType = IAuthState;
export type UserStateType = IUserProfileState;
