import { AnyAction } from "redux";
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
    VolunteerActionType,
} from "../types";
import { updateObject } from "../utils";

// Narrows the VolunteerActionType union to the single member with the given
// `type`, so each reducer helper can be typed to exactly the action it handles.
type VAction<T extends VolunteerActionType["type"]> = Extract<
    VolunteerActionType,
    { type: T }
>;

export interface IVolunteerState {
    categoryTypes: IVolunteerCategoryType[];
    categories: IVolunteerCategory[];
    mappedRoles: EventCategoryType[];
    eventDates: IEventDate[];
    error: string | null;
    loading: boolean;
    eventDatesLoading: boolean;
}

const initialState: IVolunteerState = {
    categories: [DefaultVolunteerCategory],
    categoryTypes: [DefaultVolunteerCategoryType],
    mappedRoles: [defaultEventCategory],
    eventDates: [],
    loading: false,
    error: null,
    eventDatesLoading: false,
};

const getVolunteerCategoryTypes = (
    state: IVolunteerState,
    action: VAction<typeof actionTypes.GET_VOLUNTEER_CATEGORY_TYPES>
) => {
    return updateObject(state, {
        categoryTypes: action.payload,
    });
};

const getVolunteerCategoriesStart = (state: IVolunteerState) => {
    return updateObject(state, {
        error: null,
        loading: true,
    });
};

const getVolunteerCategoriesSuccess = (
    state: IVolunteerState,
    action: VAction<typeof actionTypes.GET_VOLUNTEER_CATEGORIES_SUCCESS>
) => {
    return updateObject(state, {
        categories: action.payload,
        error: null,
        loading: false,
    });
};

const getVolunteerCategoriesFail = (
    state: IVolunteerState,
    action: VAction<typeof actionTypes.GET_VOLUNTEER_CATEGORIES_FAIL>
) => {
    return updateObject(state, {
        error: action.error,
        loading: false,
    });
};

const getMappedVolunteerRolesStart = (state: IVolunteerState) => {
    return updateObject(state, {
        error: null,
        loading: true,
    });
};

const getMappedVolunteerRolesSuccess = (
    state: IVolunteerState,
    action: VAction<typeof actionTypes.GET_MAPPED_VOLUNTEER_ROLES_SUCCESS>
) => {
    return updateObject(state, {
        mappedRoles: action.payload,
        error: null,
        loading: false,
    });
};

const getMappedVolunteerRolesFail = (
    state: IVolunteerState,
    action: VAction<typeof actionTypes.GET_MAPPED_VOLUNTEER_ROLES_FAIL>
) => {
    return updateObject(state, {
        error: action.error,
        loading: false,
    });
};

const acceptRequestStart = (state: IVolunteerState) => {
    return updateObject(state, {
        error: null,
        loading: true,
    });
};

const acceptRequestSuccess = (state: IVolunteerState) => {
    return updateObject(state, {
        error: null,
        loading: false,
    });
};

const acceptRequestFail = (
    state: IVolunteerState,
    action: VAction<typeof actionTypes.ACCEPT_REQUEST_FAIL>
) => {
    return updateObject(state, {
        error: action.error,
        loading: false,
    });
};

const denyRequestStart = (state: IVolunteerState) => {
    return updateObject(state, {
        error: null,
        loading: true,
    });
};

const denyRequestSuccess = (state: IVolunteerState) => {
    return updateObject(state, {
        error: null,
        loading: false,
    });
};

const denyRequestFail = (
    state: IVolunteerState,
    action: VAction<typeof actionTypes.DENY_REQUEST_FAIL>
) => {
    return updateObject(state, {
        error: action.error,
        loading: false,
    });
};

const changeRequestRoleStart = (state: IVolunteerState) => {
    return updateObject(state, {
        error: null,
        loading: true,
    });
};

const changeRequestRoleSuccess = (state: IVolunteerState) => {
    return updateObject(state, {
        error: null,
        loading: false,
    });
};

const changeRequestRoleFail = (
    state: IVolunteerState,
    action: VAction<typeof actionTypes.CHANGE_REQUEST_ROLE_FAIL>
) => {
    return updateObject(state, {
        error: action.error,
        loading: false,
    });
};

const getVolunteerCategoriesOfType = (
    state: IVolunteerState,
    action: VAction<typeof actionTypes.GET_VOLUNTEER_CATEGORY_OF_TYPE>
) => {
    return updateObject(state, {
        categories: action.payload,
    });
};

const getEventDatesStart = (state: IVolunteerState) => {
    return updateObject(state, {
        error: null,
        eventDatesLoading: true,
    });
};

const getEventDatesSuccess = (
    state: IVolunteerState,
    action: VAction<typeof actionTypes.GET_EVENT_DATES_SUCCESS>
) => {
    return updateObject(state, {
        eventDates: action.payload,
        error: null,
        eventDatesLoading: false,
    });
};

const getEventDatesFail = (
    state: IVolunteerState,
    action: VAction<typeof actionTypes.GET_EVENT_DATES_FAIL>
) => {
    return updateObject(state, {
        error: action.error,
        eventDatesLoading: false,
    });
};

export const reducer = (
    state = initialState,
    incomingAction: AnyAction
) => {
    const action = incomingAction as VolunteerActionType;
    switch (action.type) {
        case actionTypes.GET_VOLUNTEER_CATEGORY_TYPES:
            return getVolunteerCategoryTypes(state, action);
        case actionTypes.GET_VOLUNTEER_CATEGORIES_START:
            return getVolunteerCategoriesStart(state);
        case actionTypes.GET_VOLUNTEER_CATEGORIES_SUCCESS:
            return getVolunteerCategoriesSuccess(state, action);
        case actionTypes.GET_VOLUNTEER_CATEGORIES_FAIL:
            return getVolunteerCategoriesFail(state, action);
        case actionTypes.GET_MAPPED_VOLUNTEER_ROLES_START:
            return getMappedVolunteerRolesStart(state);
        case actionTypes.GET_MAPPED_VOLUNTEER_ROLES_SUCCESS:
            return getMappedVolunteerRolesSuccess(state, action);
        case actionTypes.GET_MAPPED_VOLUNTEER_ROLES_FAIL:
            return getMappedVolunteerRolesFail(state, action);
        case actionTypes.ACCEPT_REQUEST_START:
            return acceptRequestStart(state);
        case actionTypes.ACCEPT_REQUEST_SUCCESS:
            return acceptRequestSuccess(state);
        case actionTypes.ACCEPT_REQUEST_FAIL:
            return acceptRequestFail(state, action);
        case actionTypes.DENY_REQUEST_START:
            return denyRequestStart(state);
        case actionTypes.DENY_REQUEST_SUCCESS:
            return denyRequestSuccess(state);
        case actionTypes.DENY_REQUEST_FAIL:
            return denyRequestFail(state, action);
        case actionTypes.CHANGE_REQUEST_ROLE_START:
            return changeRequestRoleStart(state);
        case actionTypes.CHANGE_REQUEST_ROLE_SUCCESS:
            return changeRequestRoleSuccess(state);
        case actionTypes.CHANGE_REQUEST_ROLE_FAIL:
            return changeRequestRoleFail(state, action);
        case actionTypes.GET_VOLUNTEER_CATEGORY_OF_TYPE:
            return getVolunteerCategoriesOfType(state, action);
        case actionTypes.GET_EVENT_DATES_START:
            return getEventDatesStart(state);
        case actionTypes.GET_EVENT_DATES_SUCCESS:
            return getEventDatesSuccess(state, action);
        case actionTypes.GET_EVENT_DATES_FAIL:
            return getEventDatesFail(state, action);
        default:
            return state;
    }
};
