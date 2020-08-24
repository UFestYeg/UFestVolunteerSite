import { Typography } from "@material-ui/core";
import React from "react";
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

export const buildErrorMessage = (error: any) => {
    const errorMessages: any[] = [];
    if (error && error.response && error.response.data) {
        Object.entries(error.response.data).forEach((e) => {
            const errorMarkup = (
                <Typography variant="body1" color="error">
                    {`${e[0]}: ${e[1]}`}
                </Typography>
            );
            errorMessages.push(errorMarkup);
        });
    } else if (error && error.message) {
        errorMessages.push(
            <Typography variant="body1" color="error">
                {error.message}
            </Typography>
        );
    }

    return errorMessages;
};
