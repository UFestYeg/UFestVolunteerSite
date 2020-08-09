import axios from "axios";
import { VolunteerUrls } from "../../constants";
import {
    IVolunteerCategory,
    IVolunteerCategoryType,
    VolunteerActionType as ActionType,
} from "../types";
import * as ActionTypes from "./actionTypes";

type DispatchType = (action: ActionType) => void;

export const setCategoryTypes = (
    payload: IVolunteerCategoryType[]
): ActionType => {
    return {
        type: ActionTypes.GET_VOLUNTEER_CATEGORY_TYPES,
        payload,
    };
};

export const setVolunteerCategoriesOfType = (
    payload: IVolunteerCategory[]
): ActionType => {
    return {
        type: ActionTypes.GET_VOLUNTEER_CATEGORY_OF_TYPE,
        payload,
    };
};

export const getVolunteerCategoryTypes = () => {
    const token = localStorage.getItem("token");
    return (dispatch: DispatchType) => {
        if (token) {
            axios.defaults.headers = {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            };
            axios
                .get(VolunteerUrls.CATEGORY_TYPE_LIST)
                .then((response) => {
                    console.log(response.data);
                    dispatch(setCategoryTypes(response.data));
                })
                .catch((error) => {
                    // If request is bad...
                    // Show an error to the user
                    console.error(error);
                    // TODO: send notification and redirect
                });
        } else {
            console.log("Unable to get category without token");
        }
    };
};

export const getVolunteerCategoryOfType = (categoryTypeID: number) => {
    const token = localStorage.getItem("token");
    return (dispatch: DispatchType) => {
        if (token) {
            axios.defaults.headers = {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            };
            axios
                .get(VolunteerUrls.CATEGORIES_OF_TYPE_LIST(categoryTypeID))
                .then((response) => {
                    console.log(response.data);
                    dispatch(setVolunteerCategoriesOfType(response.data));
                })
                .catch((error) => {
                    // If request is bad...
                    // Show an error to the user
                    console.error(error);
                    // TODO: send notification and redirect
                });
        } else {
            console.log("Unable to get category without token");
        }
    };
};
