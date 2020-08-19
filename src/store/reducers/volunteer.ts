import {
    defaultEventCategory,
    EventCategoryType,
} from "../../components/Calendar/EventCategory";
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
    mappedRoles: EventCategoryType[];
    error: any | null;
    loading: boolean;
}

const initialState: IVolunteerState = {
    categories: [DefaultVolunteerCategory],
    categoryTypes: [DefaultVolunteerCategoryType],
    mappedRoles: [defaultEventCategory],
    loading: false,
    error: null,
};

const getVolunteerCategoryTypes = (state: IVolunteerState, action: any) => {
    return updateObject(state, {
        categoryTypes: action.payload,
    });
};

const getVolunteerCategoriesStart = (state: IVolunteerState, action: any) => {
    return updateObject(state, {
        error: null,
        loading: true,
    });
};

const getVolunteerCategoriesSuccess = (state: IVolunteerState, action: any) => {
    return updateObject(state, {
        categories: action.payload,
        error: null,
        loading: false,
    });
};

const getVolunteerCategoriesFail = (state: IVolunteerState, action: any) => {
    return updateObject(state, {
        error: action.error,
        loading: false,
    });
};

const getMappedVolunteerRolesStart = (state: IVolunteerState, action: any) => {
    return updateObject(state, {
        error: null,
        loading: true,
    });
};

const getMappedVolunteerRolesSuccess = (
    state: IVolunteerState,
    action: any
) => {
    return updateObject(state, {
        mappedRoles: action.payload,
        error: null,
        loading: false,
    });
};

const getMappedVolunteerRolesFail = (state: IVolunteerState, action: any) => {
    return updateObject(state, {
        error: action.error,
        loading: false,
    });
};

const acceptRequestStart = (state: IVolunteerState, action: any) => {
    return updateObject(state, {
        error: null,
        loading: true,
    });
};

const acceptRequestSuccess = (state: IVolunteerState, action: any) => {
    return updateObject(state, {
        error: null,
        loading: false,
    });
};

const acceptRequestFail = (state: IVolunteerState, action: any) => {
    return updateObject(state, {
        error: action.error,
        loading: false,
    });
};

const denyRequestStart = (state: IVolunteerState, action: any) => {
    return updateObject(state, {
        error: null,
        loading: true,
    });
};

const denyRequestSuccess = (state: IVolunteerState, action: any) => {
    return updateObject(state, {
        error: null,
        loading: false,
    });
};

const denyRequestFail = (state: IVolunteerState, action: any) => {
    return updateObject(state, {
        error: action.error,
        loading: false,
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
        case actionTypes.GET_VOLUNTEER_CATEGORIES_START:
            return getVolunteerCategoriesStart(state, action);
        case actionTypes.GET_VOLUNTEER_CATEGORIES_SUCCESS:
            return getVolunteerCategoriesSuccess(state, action);
        case actionTypes.GET_VOLUNTEER_CATEGORIES_FAIL:
            return getVolunteerCategoriesFail(state, action);
        case actionTypes.GET_MAPPED_VOLUNTEER_ROLES_START:
            return getMappedVolunteerRolesStart(state, action);
        case actionTypes.GET_MAPPED_VOLUNTEER_ROLES_SUCCESS:
            return getMappedVolunteerRolesSuccess(state, action);
        case actionTypes.GET_MAPPED_VOLUNTEER_ROLES_FAIL:
            return getMappedVolunteerRolesFail(state, action);
        case actionTypes.ACCEPT_REQUEST_START:
            return acceptRequestStart(state, action);
        case actionTypes.ACCEPT_REQUEST_SUCCESS:
            return acceptRequestSuccess(state, action);
        case actionTypes.ACCEPT_REQUEST_FAIL:
            return acceptRequestFail(state, action);
        case actionTypes.DENY_REQUEST_START:
            return denyRequestStart(state, action);
        case actionTypes.DENY_REQUEST_SUCCESS:
            return denyRequestSuccess(state, action);
        case actionTypes.DENY_REQUEST_FAIL:
            return denyRequestFail(state, action);
        case actionTypes.GET_VOLUNTEER_CATEGORY_OF_TYPE:
            return getVolunteerCategoriesOfType(state, action);
        default:
            return state;
    }
};
