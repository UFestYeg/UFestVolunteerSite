import { actionTypes } from "../actions";
import {
    DefaultVolunteerCategory,
    DefaultVolunteerCategoryType,
    IVolunteerCategory,
    IVolunteerCategoryType,
} from "../types";
import { updateObject } from "../utils";

export interface IVolunteerState {
    categoryTypes: IVolunteerCategoryType[];
    categories: IVolunteerCategory[];
}

const initialState: IVolunteerState = {
    categoryTypes: [DefaultVolunteerCategoryType],
    categories: [DefaultVolunteerCategory],
};

const getVolunteerCategoryTypes = (state: IVolunteerState, action: any) => {
    return updateObject(state, {
        categoryTypes: action.payload,
    });
};

const getVolunteerCategoriesOfType = (state: IVolunteerState, action: any) => {
    return updateObject(state, {
        categories: action.payload,
    });
};

export const reducer = (state = initialState, action: any) => {
    switch (action.type) {
        case actionTypes.GET_VOLUNTEER_CATEGORY_TYPES:
            return getVolunteerCategoryTypes(state, action);
        case actionTypes.GET_VOLUNTEER_CATEGORY_OF_TYPE:
            return getVolunteerCategoriesOfType(state, action);
        default:
            return state;
    }
};
