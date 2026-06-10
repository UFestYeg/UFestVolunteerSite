import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { EventCategoryType } from "../../components/Calendar/EventCategory";
import { UserUrls, VolunteerUrls } from "../../constants";
import { navigate } from "../../navigation";
import {
    IEventDate,
    IVolunteerCategory,
    IVolunteerCategoryType,
    VolunteerActionType as ActionType,
} from "../types";
import * as ActionTypes from "./actionTypes";
import { logDev, notifyApiError, setAuthHeaders } from "./apiUtils";

type DispatchType = (action: ActionType) => void;

export const setCategoryTypes = (
    payload: IVolunteerCategoryType[]
): ActionType => {
    return {
        payload,
        type: ActionTypes.GET_VOLUNTEER_CATEGORY_TYPES,
    };
};

export const setVolunteerCategoriesOfType = (
    payload: IVolunteerCategory[]
): ActionType => {
    return {
        payload,
        type: ActionTypes.GET_VOLUNTEER_CATEGORY_OF_TYPE,
    };
};

export const getEventDatesStart = (): ActionType => {
    return {
        type: ActionTypes.GET_EVENT_DATES_START,
    };
};

export const getEventDatesSuccess = (payload: IEventDate[]): ActionType => {
    return {
        payload,
        type: ActionTypes.GET_EVENT_DATES_SUCCESS,
    };
};

export const getEventDatesFail = (error: any): ActionType => {
    return {
        error,
        type: ActionTypes.GET_EVENT_DATES_FAIL,
    };
};

export const getVolunteerCategoriesStart = (): ActionType => {
    return {
        type: ActionTypes.GET_VOLUNTEER_CATEGORIES_START,
    };
};

export const getVolunteerCategoriesSuccess = (
    payload: IVolunteerCategory[]
): ActionType => {
    return {
        payload,
        type: ActionTypes.GET_VOLUNTEER_CATEGORIES_SUCCESS,
    };
};

export const getVolunteerCategoriesFail = (error: any): ActionType => {
    return {
        error,
        type: ActionTypes.GET_VOLUNTEER_CATEGORIES_FAIL,
    };
};
export const getMappedVolunteerRolesStart = (): ActionType => {
    return {
        type: ActionTypes.GET_MAPPED_VOLUNTEER_ROLES_START,
    };
};

export const getMappedVolunteerRolesSuccess = (
    payload: EventCategoryType[]
): ActionType => {
    return {
        payload,
        type: ActionTypes.GET_MAPPED_VOLUNTEER_ROLES_SUCCESS,
    };
};

export const getMappedVolunteerRolesFail = (error: any): ActionType => {
    return {
        error,
        type: ActionTypes.GET_MAPPED_VOLUNTEER_ROLES_FAIL,
    };
};

export const acceptRequestStart = (): ActionType => {
    return {
        type: ActionTypes.ACCEPT_REQUEST_START,
    };
};

export const acceptRequestSuccess = (): ActionType => {
    return {
        type: ActionTypes.ACCEPT_REQUEST_SUCCESS,
    };
};

export const acceptRequestFail = (error: any): ActionType => {
    return {
        error,
        type: ActionTypes.ACCEPT_REQUEST_FAIL,
    };
};

export const denyRequestStart = (): ActionType => {
    return {
        type: ActionTypes.DENY_REQUEST_START,
    };
};

export const denyRequestSuccess = (): ActionType => {
    return {
        type: ActionTypes.DENY_REQUEST_SUCCESS,
    };
};

export const denyRequestFail = (error: any): ActionType => {
    return {
        error,
        type: ActionTypes.DENY_REQUEST_FAIL,
    };
};

export const changeRequestRoleStart = (): ActionType => {
    return {
        type: ActionTypes.CHANGE_REQUEST_ROLE_START,
    };
};

export const changeRequestRoleSuccess = (): ActionType => {
    return {
        type: ActionTypes.CHANGE_REQUEST_ROLE_SUCCESS,
    };
};

export const changeRequestRoleFail = (error: any): ActionType => {
    return {
        error,
        type: ActionTypes.CHANGE_REQUEST_ROLE_FAIL,
    };
};

export const getVolunteerCategoryTypes = (cookies: any) => {
    const token = localStorage.getItem("token");
    return (dispatch: DispatchType) => {
        if (token) {
            setAuthHeaders(token, cookies);
            axios
                .get(VolunteerUrls.CATEGORY_TYPE_LIST)
                .then((response) => {
                    dispatch(setCategoryTypes(response.data));
                })
                .catch((error) => {
                    notifyApiError(
                        error,
                        "Unable to load volunteer category types."
                    );
                });
        } else {
            logDev("Unable to get category without token");
        }
    };
};

export const getVolunteerCategories = (cookies: any) => {
    const token = localStorage.getItem("token");
    return (dispatch: DispatchType) => {
        if (token) {
            dispatch(getVolunteerCategoriesStart());
            setAuthHeaders(token, cookies);
            axios
                .get(VolunteerUrls.CATEGORY_LIST)
                .then((response) => {
                    dispatch(getVolunteerCategoriesSuccess(response.data));
                })
                .catch((error) => {
                    dispatch(getVolunteerCategoriesFail(error));
                    notifyApiError(
                        error,
                        "Unable to load volunteer categories."
                    );
                });
        } else {
            logDev("Unable to get categories without token");
        }
    };
};

export const getVolunteerCategoryOfType = (
    categoryTypeID: number,
    cookies: any
) => {
    const token = localStorage.getItem("token");
    return (dispatch: DispatchType) => {
        if (token) {
            setAuthHeaders(token, cookies);
            axios
                .get(VolunteerUrls.CATEGORIES_OF_TYPE_LIST(categoryTypeID))
                .then((response) => {
                    dispatch(setVolunteerCategoriesOfType(response.data));
                })
                .catch((error) => {
                    notifyApiError(
                        error,
                        "Unable to load volunteer categories."
                    );
                });
        } else {
            logDev("Unable to get category without token");
        }
    };
};

export const getEventDates = (cookies: any) => {
    const token = localStorage.getItem("token");
    return (dispatch: DispatchType) => {
        if (token) {
            dispatch(getEventDatesStart());
            setAuthHeaders(token, cookies);
            axios
                .get(VolunteerUrls.EVENT_DATES_LIST)
                .then((response) => {
                    dispatch(getEventDatesSuccess(response.data));
                })
                .catch((error) => {
                    dispatch(getEventDatesFail(error));
                    notifyApiError(error, "Unable to load event dates.");
                });
        } else {
            logDev("Unable to get eventdates without token");
        }
    };
};

function addRequests(events: EventCategoryType[]) {
    return axios
        .get(VolunteerUrls.REQUESTS)
        .then((resp) => {
            const requests = resp.data;
            events.map((e) => {
                const roleRequests = requests.filter(
                    (r: any) => r.role.id === e.roleID
                );
                e.requests = roleRequests;
            });
            return events;
        })
        .catch(() => {
            return events;
        });
}

function addUsers(events: EventCategoryType[]) {
    return axios
        .get(UserUrls.USER_PROFILE_LIST)
        .then((resp) => {
            const userProfiles = resp.data;
            events.forEach((e) => {
                if (e.requests && e.requests.length > 0) {
                    e.requests.forEach((r) => {
                        r.user_profile = userProfiles.find(
                            (user: any) => user.pk === r.user
                        );
                    });
                }
            });

            return events;
        })
        .catch(() => {
            return events;
        });
}

export const getMappedVolunteerRoles = (cookies: any) => {
    const token = localStorage.getItem("token");
    return (dispatch: DispatchType) => {
        if (token) {
            dispatch(getMappedVolunteerRolesStart());
            setAuthHeaders(token, cookies);
            axios
                .get(VolunteerUrls.CATEGORY_LIST_WITH_REQUESTS)
                .then((res) => {
                    const data = res.data;
                    const mappedData: EventCategoryType[] = [];
                    
                    // Transform the optimized backend response into the format expected by the frontend
                    data.forEach((category: any) => {
                        category.roles.forEach((role: any) => {
                            mappedData.push({
                                roleID: role.id,
                                title: role.title,
                                description: role.description,
                                start_time: new Date(category.start_time),
                                end_time: new Date(category.end_time),
                                category: category.category_type.tag,
                                number_of_positions: role.number_of_positions,
                                number_of_open_positions: role.number_of_open_positions,
                                resourceId: category.category_type.id,
                                eventID: category.id,
                                requests: role.requests || [], // Requests with user_profile already included
                            });
                        });
                    });
                    
                    dispatch(getMappedVolunteerRolesSuccess(mappedData));
                })
                .catch((e) => {
                    dispatch(getMappedVolunteerRolesFail(e));
                    notifyApiError(e, "Unable to load volunteer roles.");
                });
        } else {
            logDev("Unable to get mapped roles without token");
        }
    };
};

// Legacy version with parallel requests (fallback option)
export const getMappedVolunteerRolesLegacy = (cookies: any) => {
    const token = localStorage.getItem("token");
    return (dispatch: DispatchType) => {
        if (token) {
            dispatch(getMappedVolunteerRolesStart());
            setAuthHeaders(token, cookies);
            
            // Make all three requests in parallel instead of sequentially
            Promise.all([
                axios.get(VolunteerUrls.CATEGORY_LIST),
                axios.get(VolunteerUrls.REQUESTS),
                axios.get(UserUrls.USER_PROFILE_LIST),
            ])
                .then(([categoriesRes, requestsRes, usersRes]) => {
                    const data = categoriesRes.data;
                    const requests = requestsRes.data;
                    const userProfiles = usersRes.data;
                    
                    const mappedData: EventCategoryType[] = [];
                    
                    // Map categories to events
                    data.forEach((d: any) => {
                        d.roles.forEach((role: any) => {
                            const roleRequests = requests.filter(
                                (r: any) => r.role.id === role.id
                            );
                            
                            // Add user profiles to requests
                            roleRequests.forEach((r: any) => {
                                r.user_profile = userProfiles.find(
                                    (user: any) => user.pk === r.user
                                );
                            });
                            
                            mappedData.push({
                                roleID: role.id,
                                title: role.title,
                                description: role.description,
                                start_time: new Date(d.start_time),
                                end_time: new Date(d.end_time),
                                category: d.category_type.tag,
                                number_of_positions: role.number_of_positions,
                                number_of_open_positions: role.number_of_open_positions,
                                resourceId: d.category_type.id,
                                eventID: d.id,
                                requests: roleRequests,
                            });
                        });
                    });
                    
                    dispatch(getMappedVolunteerRolesSuccess(mappedData));
                })
                .catch((e) => {
                    dispatch(getMappedVolunteerRolesFail(e));
                    notifyApiError(e, "Unable to load volunteer roles.");
                });
        } else {
            logDev("Unable to get mapped roles without token");
        }
    };
};

export const acceptRequest = (
    request: any,
    redirectUrl: string,
    browserState: any,
    cookies: any
) => {
    const token = localStorage.getItem("token");
    return (dispatch: DispatchType) => {
        if (token) {
            dispatch(acceptRequestStart());
            setAuthHeaders(token, cookies);
            axios
                .put(VolunteerUrls.REQUESTS_DETAILS(request.id), {
                    ...request,
                    status: "ACCEPTED",
                })
                .then(() => {
                    enqueueSnackbar(
                        `You accepted ${request.user_profile.first_name} ${request.user_profile.last_name}'s request on ${request.role.title}`,
                        { variant: "success" }
                    );
                    dispatch(acceptRequestSuccess());
                    // Persist the current view/filters into the history entry
                    // (without a reload) so the browser back button restores
                    // them, then refetch the calendar data in place. Avoiding a
                    // full reload keeps the success snackbar alive.
                    navigate(redirectUrl, {
                        state: browserState,
                        replace: true,
                    });
                    getMappedVolunteerRoles(cookies)(dispatch);
                })
                .catch((err) => {
                    dispatch(acceptRequestFail(err));
                    notifyApiError(err, "Could not accept the request.");
                });
        }
    };
};

export const denyRequest = (
    request: any,
    redirectUrl: string,
    browserState: any,
    cookies: any
) => {
    const token = localStorage.getItem("token");
    return (dispatch: DispatchType) => {
        if (token) {
            dispatch(denyRequestStart());
            setAuthHeaders(token, cookies);
            axios
                .put(VolunteerUrls.REQUESTS_DETAILS(request.id), {
                    ...request,
                    status: "DENIED",
                })
                .then(() => {
                    enqueueSnackbar(
                        `You denied ${request.user_profile.first_name} ${request.user_profile.last_name}'s request on ${request.role.title}`,
                        { variant: "success" }
                    );
                    dispatch(denyRequestSuccess());
                    // Persist the current view/filters into the history entry
                    // (without a reload) so the browser back button restores
                    // them, then refetch the calendar data in place. Avoiding a
                    // full reload keeps the success snackbar alive.
                    navigate(redirectUrl, {
                        state: browserState,
                        replace: true,
                    });
                    getMappedVolunteerRoles(cookies)(dispatch);
                })
                .catch((err) => {
                    dispatch(denyRequestFail(err));
                    notifyApiError(err, "Could not deny the request.");
                });
        }
    };
};

export const changeRequestRole = (
    request: any,
    role: any,
    redirectUrl: string,
    browserState: any,
    cookies: any
) => {
    const token = localStorage.getItem("token");
    const payload = {
        ...request,
        role,
    };

    return (dispatch: DispatchType) => {
        if (token) {
            dispatch(changeRequestRoleStart());
            setAuthHeaders(token, cookies);
            axios
                .put(VolunteerUrls.REQUESTS_DETAILS(request.id), payload)
                .then(() => {
                    enqueueSnackbar(
                        `You swapped ${request.user_profile.first_name} ${request.user_profile.last_name}'s role to ${role.title}`,
                        { variant: "success" }
                    );
                    dispatch(changeRequestRoleSuccess());
                    navigate(redirectUrl, {
                        state: browserState,
                        replace: true,
                    });
                    navigate(0);
                })
                .catch((err) => {
                    dispatch(changeRequestRoleFail(err));
                    notifyApiError(
                        err,
                        `Could not swap ${request.user_profile.first_name} ${request.user_profile.last_name}'s role.`
                    );
                });
        }
    };
};
