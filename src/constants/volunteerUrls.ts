import { ROOT_URL } from "./urls";

const VolunteerUrls = {
    CATEGORY_DETAILS: (categoryID: number) =>
        `${ROOT_URL}api/categories/${categoryID}/`,
    CATEGORY_LIST: `${ROOT_URL}api/categories`,
};

export default VolunteerUrls;
