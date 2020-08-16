import { ROOT_URL } from "./urls";

const VolunteerUrls = {
    CATEGORY_TYPE_DETAILS: (categoryTypeID: number) =>
        `${ROOT_URL}api/categories/${categoryTypeID}/`,
    CATEGORY_TYPE_LIST: `${ROOT_URL}api/categories/`,
    CATEGORY_DETAILS: (categoryTypeID: number) =>
        `${ROOT_URL}api/positions/${categoryTypeID}/`,
    CATEGORY_LIST: `${ROOT_URL}api/positions/`,
    CATEGORIES_OF_TYPE_LIST: (categoryTypeID: number) =>
        `${ROOT_URL}api/positions/category/${categoryTypeID}/`,
    CATEGORIES_WITH_ROLE_LIST: (categoryTypeID: number, roleID: number) =>
        `${ROOT_URL}api/positions/category/${categoryTypeID}/roles/${roleID}/`,
    REQUESTS: `${ROOT_URL}api/requests/`,
    REQUESTS_DETAILS: (requestID: number) =>
        `${ROOT_URL}api/requests/${requestID}/`,
};

export default VolunteerUrls;
