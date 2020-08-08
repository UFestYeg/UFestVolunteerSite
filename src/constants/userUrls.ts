import { ROOT_URL } from "./urls";

const UserUrls = {
    POSITION_DETAILS: (positionID: number) =>
        `${ROOT_URL}api/positions/${positionID}/`,
    POSITION_LIST: `${ROOT_URL}api/positions/`,
};

export default UserUrls;
