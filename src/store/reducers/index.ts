import { IAuthState, reducer as authReducer } from "./auth";
import { IUserProfileState, reducer as userReducer } from "./user";
import { IVolunteerState, reducer as volunteerReducer } from "./volunteer";

export { authReducer, userReducer, volunteerReducer };
export type AuthStateType = IAuthState;
export type UserStateType = IUserProfileState;
export type VolunteerStateType = IVolunteerState;
