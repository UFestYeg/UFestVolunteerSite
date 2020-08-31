import axios from "axios";
import { Notification } from "react-notification-system";
import { error, success } from "react-notification-system-redux";
import { EventCategoryType } from "../../components/Calendar/EventCategory";
import { UserUrls, VolunteerUrls } from "../../constants";
import history from "../../history";
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
                    console.log(response.data);
                    dispatch(getVolunteerCategoriesSuccess(response.data));
                })
                .catch((error) => {
                    // If request is bad...
                    // Show an error to the user
                    console.error(error);
                    dispatch(getVolunteerCategoriesFail(error));
                    // TODO: send notification and redirect
                });
        } else {
            console.log("Unable to get categories without token");
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
                .get(VolunteerUrls.CATEGORY_LIST)
                .then((res) => {
                    const data = res.data;
                    const mappedData: EventCategoryType[] = [];
                    data.forEach((d: any, idx: number, arr: any[]) => {
                        d.roles.forEach((role: any) => {
                            mappedData.push({
                                roleID: role.id,
                                title: role.title,
                                description: role.description,
                                start_time: new Date(d.start_time),
                                end_time: new Date(d.end_time),
                                category: d.category_type.tag,
                                number_of_positions: role.number_of_positions,
                                number_of_open_positions:
                                    role.number_of_open_positions,
                                resourceId: d.category_type.id, // attribute_id
                                eventID: d.id,
                            });
                        });
                        return mappedData;
                    });
                    return mappedData;
                })
                .then((partialData) => addRequests(partialData))
                .then((partialData) => addUsers(partialData))
                .then((mappedEvents) => {
                    dispatch(getMappedVolunteerRolesSuccess(mappedEvents));
                })
                .catch((e) => dispatch(getMappedVolunteerRolesFail(e)));
        } else {
            console.log("Unable to get mapped roles without token");
        }
    };
};

export const acceptRequest = (
    request: any,
    redirectUrl: string,
    browserState: any,
    cookies: any
) => {
    console.log("request", request);
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
                        message: `You accepted ${request.user_profile.first_name} ${request.user_profile.last_name}'s request`,
                        position: "tr",
                        autoDismiss: 5,
                    };
                    dispatch(success(notificationOpts));
                    dispatch(acceptRequestSuccess());
                    // redirect to the route '/profile'
                    history.replace(redirectUrl, browserState);
                    history.go(0);
                    console.log(res);
                })
                .catch((err) => {
                    dispatch(acceptRequestFail(err));
                    console.error(err);
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
                        message: `You denied ${request.user_profile.first_name} ${request.user_profile.last_name}'s request`,
                        position: "tr",
                        autoDismiss: 5,
                    };
                    dispatch(success(notificationOpts));
                    dispatch(denyRequestSuccess());
                    history.replace(redirectUrl, browserState);
                    history.go(0);
                    console.log("res", res);
                })
                .catch((err) => {
                    dispatch(denyRequestFail(err));
                    console.error(err);
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
                        message: `You swapped ${request.user_profile.first_name} ${request.user_profile.last_name}'s role`,
                        position: "tr",
                        autoDismiss: 5,
                    };
                    dispatch(success(notificationOpts));
                    dispatch(changeRequestRoleSuccess());
                    console.log(res);
                    history.replace(redirectUrl, browserState);
                    history.go(0);
                })
                .catch((err) => {
                    const notificationOpts: Notification = {
                        title: "Oops, something went wrong!",
                        message: `Could not swap ${request.user_profile.first_name} ${request.user_profile.last_name}'s role`,
                        position: "tr",
                        autoDismiss: 5,
                    };
                    dispatch(error(notificationOpts));
                    dispatch(changeRequestRoleFail(err));
                    console.error(err);
                });
        }
    };
};
