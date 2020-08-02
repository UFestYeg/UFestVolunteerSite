import { IUserProfile } from "./types";

export const updateObject = (oldObject: any, updatedProperties: any) => {
    return {
        ...oldObject,
        ...updatedProperties,
    };
};

export const userAvatarString = (userProfile: IUserProfile) => {
    return userProfile && userProfile.first_name
        ? `${userProfile.first_name.charAt(0)}${userProfile.last_name.charAt(
              0
          )}`
        : "User";
};
