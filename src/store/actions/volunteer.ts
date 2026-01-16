import axios from "axios";
import { Notification } from "react-notification-system";
import { error, success } from "react-notification-system-redux";
import { EventCategoryType } from "../../components/Calendar/EventCategory";
import { UserUrls, VolunteerUrls } from "../../constants";
import history from "../../history";
import logger from "../../logger";
import {
    IEventDate,
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
            axios.defaults.headers = {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
                "X-CSRFToken": cookies,
            };
            axios
                .get(VolunteerUrls.CATEGORY_TYPE_LIST)
                .then((response) => {
                    logger.debug(response.data);
                    dispatch(setCategoryTypes(response.data));
                })
                .catch((error) => {
                    // If request is bad...
                    // Show an error to the user
                    // TODO: send notification and redirect
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        logger.error(error.response.data);
                        logger.error(error.response.status);
                        logger.error(error.response.headers);
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        logger.error(error.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        logger.error("Error", error.message);
                    }
                    logger.debug(error.config);
                    logger.error(error);
                });
        } else {
            logger.warn("Unable to get category without token");
        }
    };
};

export const getVolunteerCategories = (cookies: any) => {
    const token = localStorage.getItem("token");
    return (dispatch: DispatchType) => {
        if (token) {
            dispatch(getVolunteerCategoriesStart());
            axios.defaults.headers = {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
                "X-CSRFToken": cookies,
            };
            axios
                .get(VolunteerUrls.CATEGORY_LIST)
                .then((response) => {
                    logger.debug(response.data);
                    dispatch(getVolunteerCategoriesSuccess(response.data));
                })
                .catch((error) => {
                    // If request is bad...
                    // Show an error to the user
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        logger.error(error.response.data);
                        logger.error(error.response.status);
                        logger.error(error.response.headers);
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        logger.error(error.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        logger.error("Error", error.message);
                    }
                    logger.debug(error.config);
                    logger.error(error);
                    dispatch(getVolunteerCategoriesFail(error));
                    // TODO: send notification and redirect
                });
        } else {
            logger.warn("Unable to get categories without token");
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
            axios.defaults.headers = {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
                "X-CSRFToken": cookies,
            };
            axios
                .get(VolunteerUrls.CATEGORIES_OF_TYPE_LIST(categoryTypeID))
                .then((response) => {
                    logger.debug(response.data);
                    dispatch(setVolunteerCategoriesOfType(response.data));
                })
                .catch((error) => {
                    // If request is bad...
                    // Show an error to the user
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        logger.error(error.response.data);
                        logger.error(error.response.status);
                        logger.error(error.response.headers);
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        logger.error(error.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        logger.error("Error", error.message);
                    }
                    logger.debug(error.config);
                    logger.error(error);
                    // TODO: send notification and redirect
                });
        } else {
            logger.warn("Unable to get category without token");
        }
    };
};

export const getEventDates = (cookies: any) => {
    const token = localStorage.getItem("token");
    return (dispatch: DispatchType) => {
        if (token) {
            dispatch(getEventDatesStart());
            axios.defaults.headers = {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
                "X-CSRFToken": cookies,
            };
            axios
                .get(VolunteerUrls.EVENT_DATES_LIST)
                .then((response) => {
                    logger.debug(response.data);
                    dispatch(getEventDatesSuccess(response.data));
                })
                .catch((error) => {
                    // If request is bad...
                    // Show an error to the user
                    // TODO: send notification and redirect
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        logger.error("Error");
                        logger.error(error.response.data);
                        logger.error(error.response.status);
                        logger.error(error.response.headers);
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        logger.error("Error", error.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        logger.error("Error", error.message);
                    }
                    logger.debug(error.config);
                    logger.error(error);
                    dispatch(getEventDatesSuccess(error));
                });
        } else {
            logger.warn("Unable to get eventdates without token");
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
            axios.defaults.headers = {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
                "X-CSRFToken": cookies,
            };
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
                .catch((e) => dispatch(getMappedVolunteerRolesFail(e)));
        } else {
            logger.warn("Unable to get mapped roles without token");
        }
    };
};

// Legacy version with parallel requests (fallback option)
export const getMappedVolunteerRolesLegacy = (cookies: any) => {
    const token = localStorage.getItem("token");
    return (dispatch: DispatchType) => {
        if (token) {
            dispatch(getMappedVolunteerRolesStart());
            axios.defaults.headers = {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
                "X-CSRFToken": cookies,
            };
            
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
                .catch((e) => dispatch(getMappedVolunteerRolesFail(e)));
        } else {
            logger.warn("Unable to get mapped roles without token");
        }
    };
};

export const acceptRequest = (
    request: any,
    redirectUrl: string,
    browserState: any,
    cookies: any
) => {
    logger.debug("request", request);
    const token = localStorage.getItem("token");
    return (dispatch: DispatchType) => {
        if (token) {
            dispatch(acceptRequestStart());
            axios.defaults.headers = {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
                "X-CSRFToken": cookies,
            };
            axios
                .put(VolunteerUrls.REQUESTS_DETAILS(request.id), {
                    ...request,
                    status: "ACCEPTED",
                })
                .then((res) => {
                    const notificationOpts: Notification = {
                        title: "Success!",
                        message: `You accepted ${request.user_profile.first_name} ${request.user_profile.last_name}'s request on ${request.role.title}`,
                        position: "tr",
                        autoDismiss: 5,
                    };
                    dispatch(success(notificationOpts));
                    dispatch(acceptRequestSuccess());
                    // redirect to the route '/profile'
                    history.replace(redirectUrl, browserState);
                    history.go(0);
                    logger.debug(res);
                })
                .catch((err) => {
                    dispatch(acceptRequestFail(err));
                    if (err.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        logger.error(err.response.data);
                        logger.error(err.response.status);
                        logger.error(err.response.headers);
                    } else if (err.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        logger.error(err.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        logger.error("Error", err.message);
                    }
                    logger.debug(err.config);
                    logger.error(err);
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
            axios.defaults.headers = {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
                "X-CSRFToken": cookies,
            };
            axios
                .put(VolunteerUrls.REQUESTS_DETAILS(request.id), {
                    ...request,
                    status: "DENIED",
                })
                .then((res) => {
                    const notificationOpts: Notification = {
                        title: "Success!",
                        message: `You denied ${request.user_profile.first_name} ${request.user_profile.last_name}'s request on ${request.role.title}`,
                        position: "tr",
                        autoDismiss: 5,
                    };
                    dispatch(success(notificationOpts));
                    dispatch(denyRequestSuccess());
                    history.replace(redirectUrl, browserState);
                    history.go(0);
                    logger.debug("res", res);
                })
                .catch((err) => {
                    dispatch(denyRequestFail(err));
                    if (err.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        logger.error(err.response.data);
                        logger.error(err.response.status);
                        logger.error(err.response.headers);
                    } else if (err.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        logger.error(err.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        logger.error("Error", err.message);
                    }
                    logger.debug(err.config);
                    logger.error(err);
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
            axios.defaults.headers = {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
                "X-CSRFToken": cookies,
            };
            axios
                .put(VolunteerUrls.REQUESTS_DETAILS(request.id), payload)
                .then((res) => {
                    const notificationOpts: Notification = {
                        title: "Success!",
                        message: `You swapped ${request.user_profile.first_name} ${request.user_profile.last_name}'s role to ${role.title}`,
                        position: "tr",
                        autoDismiss: 5,
                    };
                    dispatch(success(notificationOpts));
                    dispatch(changeRequestRoleSuccess());
                    logger.debug(res);
                    history.replace(redirectUrl, browserState);
                    history.go(0);
                })
                .catch((err) => {
                    const notificationOpts: Notification = {
                        title: "Oops, something went wrong!",
                        message:
                            `Could not swap ${request.user_profile.first_name} ${request.user_profile.last_name}'s role` +
                            `${
                                err?.response?.data
                                    ? `:${err.response.data.detail}`
                                    : ""
                            }`,
                        position: "tr",
                        autoDismiss: 5,
                    };
                    dispatch(error(notificationOpts));
                    dispatch(changeRequestRoleFail(err));
                    if (err.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        logger.error(err.response.data);
                        logger.error(err.response.status);
                        logger.error(err.response.headers);
                    } else if (err.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        logger.error(err.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        logger.error("Error", err.message);
                    }
                    logger.debug(err.config);
                    logger.error(err);
                });
        }
    };
};
