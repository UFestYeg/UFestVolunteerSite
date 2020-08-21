import { ROOT_URL } from "./urls";

const UserUrls = {
    USER_PROFILE_DETAILS: (userProfileID: number) =>
        `${ROOT_URL}api/users/user_profiles/${userProfileID}`,
    USER_PROFILE_LIST: `${ROOT_URL}api/users/user_profiles/`,
};

export default UserUrls;
