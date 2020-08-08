import { ROOT_URL } from "./urls";

const UserUrls = {
    EVENT_DETAILS: (eventID: number) => `${ROOT_URL}api/events/${eventID}/`,
    EVENT_LIST: `${ROOT_URL}api/events`,
};

export default UserUrls;
