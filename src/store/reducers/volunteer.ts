import {
    defaultEventCategory,
    EventCategoryType,
} from "../../components/Calendar/EventCategory";
import { actionTypes } from "../actions";
import {
    DefaultVolunteerCategory,
    DefaultVolunteerCategoryType,
    IEventDate,
    IVolunteerCategory,
    IVolunteerCategoryType,
} from "../types";
import { updateObject } from "../utils";

export interface IVolunteerState {
    categoryTypes: IVolunteerCategoryType[];
    categories: IVolunteerCategory[];
    mappedRoles: EventCategoryType[];
    eventDates: IEventDate[];
    error: any | null;
    loading: boolean;
}

const initialState: IVolunteerState = {
    categories: [DefaultVolunteerCategory],
    categoryTypes: [DefaultVolunteerCategoryType],
    mappedRoles: [defaultEventCategory],
    eventDates: [],
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

const changeRequestRoleStart = (state: IVolunteerState, action: any) => {
    return updateObject(state, {
        error: null,
        loading: true,
    });
};

const changeRequestRoleSuccess = (state: IVolunteerState, action: any) => {
    return updateObject(state, {
        error: null,
        loading: false,
    });
};

const changeRequestRoleFail = (state: IVolunteerState, action: any) => {
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

const getEventDatesStart = (state: IVolunteerState, action: any) => {
    return updateObject(state, {
        error: null,
        loading: true,
    });
};

const getEventDatesSuccess = (state: IVolunteerState, action: any) => {
    return updateObject(state, {
        eventDates: action.payload,
        error: null,
        loading: false,
    });
};

const getEventDatesFail = (state: IVolunteerState, action: any) => {
    return updateObject(state, {
        error: action.error,
        loading: false,
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
        case actionTypes.CHANGE_REQUEST_ROLE_START:
            return changeRequestRoleStart(state, action);
        case actionTypes.CHANGE_REQUEST_ROLE_SUCCESS:
            return changeRequestRoleSuccess(state, action);
        case actionTypes.CHANGE_REQUEST_ROLE_FAIL:
            return changeRequestRoleFail(state, action);
        case actionTypes.GET_VOLUNTEER_CATEGORY_OF_TYPE:
            return getVolunteerCategoriesOfType(state, action);
        case actionTypes.GET_EVENT_DATES_START:
            return getEventDatesStart(state, action);
        case actionTypes.GET_EVENT_DATES_SUCCESS:
            return getEventDatesSuccess(state, action);
        case actionTypes.GET_EVENT_DATES_FAIL:
            return getEventDatesFail(state, action);
        default:
            return state;
    }
};
