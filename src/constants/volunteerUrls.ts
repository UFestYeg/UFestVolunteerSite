import { ROOT_URL } from "./urls";

const VolunteerUrls = {
    CATEGORY_TYPE_DETAILS: (categoryTypeID: number) =>
        `${ROOT_URL}api/categories/${categoryTypeID}/`,
    CATEGORY_TYPE_LIST: `${ROOT_URL}api/categories/`,
    CATEGORY_DETAILS: (categoryID: number) =>
        `${ROOT_URL}api/positions/${categoryID}/`,
    CATEGORY_LIST: `${ROOT_URL}api/positions/?use_event_dates=true`,
    CATEGORIES_OF_TYPE_LIST: (categoryTypeID: number) =>
        `${ROOT_URL}api/positions/category/${categoryTypeID}/?use_event_dates=true`,
    CATEGORIES_WITH_ROLE_LIST: (categoryTypeID: number, roleID: number) =>
        `${ROOT_URL}api/positions/category/${categoryTypeID}/roles/${roleID}/?use_event_dates=true`,
    REQUESTS: `${ROOT_URL}api/requests/?use_event_dates=true`,
    REQUESTS_DETAILS: (requestID: number) =>
        `${ROOT_URL}api/requests/${requestID}/`,
    EVENT_DATES_LIST: `${ROOT_URL}api/eventdates/`,
};

export default VolunteerUrls;
