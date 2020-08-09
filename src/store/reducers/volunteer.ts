import { actionTypes } from "../actions";
import { DefaultVolunteerCategory, IVolunteerCategory } from "../types";
import { updateObject } from "../utils";

export interface IVolunteerState {
    categories: IVolunteerCategory[];
}

const initialState: IVolunteerState = {
    categories: [DefaultVolunteerCategory],
};

const getVolunteerCategoryTypes = (state: IVolunteerState, action: any) => {
    return updateObject(state, {
        categories: action.payload,
    });
};

export const reducer = (state = initialState, action: any) => {
    switch (action.type) {
        case actionTypes.GET_VOLUNTEER_CATEGORY_TYPES:
            return getVolunteerCategoryTypes(state, action);
        default:
            return state;
    }
};
