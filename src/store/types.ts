import { EventCategoryType } from "../components/Calendar/EventCategory";
import { TShirtSizeType } from "../types";
import { actionTypes } from "./actions";
import { AuthStateType, UserStateType, VolunteerStateType } from "./reducers";

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
    | { type: actionTypes.GetUserProfileStartType }
    | { type: actionTypes.GetUserProfileSuccessType; payload: IUserProfile }
    | {
          type: actionTypes.GetViewedUserProfileSuccessType;
          payload: IUserProfile;
      }
    | { type: actionTypes.GetUserProfileFailType; error: string }
    | { type: actionTypes.ClearUserProfileType }
    | { type: actionTypes.UpdateProfileStartType }
    | { type: actionTypes.UpdateProfileSuccessType }
    | { type: actionTypes.UpdateProfileFailType; error: string };

export type VolunteerActionType =
    | {
          type: actionTypes.GetVolunteerCategoriesTypesType;
          payload: IVolunteerCategoryType[];
      }
    | {
          type: actionTypes.GetVolunteerCategoriesStartType;
      }
    | {
          type: actionTypes.GetVolunteerCategoriesSuccessType;
          payload: IVolunteerCategory[];
      }
    | {
          type: actionTypes.GetVolunteerCategoriesFailType;
          error: string;
      }
    | {
          type: actionTypes.GetMappedVolunteerRolesStartType;
      }
    | {
          type: actionTypes.GetMappedVolunteerRolesSuccessType;
          payload: EventCategoryType[];
      }
    | {
          type: actionTypes.GetMappedVolunteerRolesFailType;
          error: string;
      }
    | {
          type: actionTypes.AcceptRequestStartType;
      }
    | {
          type: actionTypes.AcceptRequestSuccessType;
      }
    | {
          type: actionTypes.AcceptRequestFailType;
          error: string;
      }
    | {
          type: actionTypes.DenyRequestStartType;
      }
    | {
          type: actionTypes.DenyRequestSuccessType;
      }
    | {
          type: actionTypes.DenyRequestFailType;
          error: string;
      }
    | {
          type: actionTypes.ChangeRequestRoleStartType;
      }
    | {
          type: actionTypes.ChangeRequestRoleSuccessType;
      }
    | {
          type: actionTypes.ChangeRequestRoleFailType;
          error: string;
      }
    | {
          type: actionTypes.GetVolunteerCategoriesOfTypeType;
          payload: IVolunteerCategory[];
      };

export interface State {
    auth: AuthStateType;
    user: UserStateType;
    volunteer: VolunteerStateType;
    notifications: Notifications.NotificationsState;
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
    requests: IUserRequest[];
    is_staff: boolean;
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
    requests: [],
    is_staff: false,
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

export interface IVolunteerCategoryType {
    [x: string]: any;
    pk: number;
    tag: string;
}

export const DefaultVolunteerCategoryType: IVolunteerCategoryType = {
    pk: -1,
    tag: "",
};

export interface IVolunteerCategory {
    [x: string]: any;
    pk: number;
    title: string;
    description: string;
    start_time: Date | null;
    end_time: Date | null;
    category_type: string;
}

export const DefaultVolunteerCategory: IVolunteerCategory = {
    pk: -1,
    title: "",
    description: "",
    start_time: null,
    end_time: null,
    category_type: "",
};

export type IUserRequest = {
    id: number;
    user: number;
    status: string;
    role: IRole;
};

export type IVolunteerPosition = {
    category_type: number;
    description: string;
    end_time: string | Date;
    id: number;
    start_time: string | Date;
    title: string;
};

export type IRole = {
    id: number;
    title: string;
    description: string;
    number_of_slots: number;
    category: IVolunteerPosition;
};
