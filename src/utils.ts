import { IEventDate } from "./store/types";
import { IUserProfile } from "./store/types";

export const compareArrays = (a: any[], b: any[], sort: boolean = true) => {
    if (sort) {
        a.sort();
        b.sort();
    }
    return JSON.stringify(a) === JSON.stringify(b);
};

export const getEarliestDate = (dates: IEventDate[]) => {
    try {
        return dates.length > 0
            ? new Date(
                  dates.reduce((pre, cur) => {
                      return Date.parse(pre.event_date) >
                          Date.parse(cur.event_date)
                          ? cur
                          : pre;
                  }).event_date
              )
            : null;
    } catch (err) {
        console.warn(err);
        return null;
    }
};

export const getLatestDate = (dates: IEventDate[]) => {
    try {
        return new Date(
            dates.length > 0
                ? dates.reduce((pre, cur) => {
                      return Date.parse(pre.event_date) <
                          Date.parse(cur.event_date)
                          ? cur
                          : pre;
                  }).event_date
                : Date.now()
        );
    } catch (err) {
        return new Date(Date.now());
    }
};

// Fields a volunteer should fill in before requesting a position. Returns the
// human-readable labels of any that are still missing so the UI can prompt the
// volunteer to complete their profile first.
export const getIncompleteProfileFields = (
    userProfile: IUserProfile
): string[] => {
    const missing: string[] = [];
    const isBlank = (value?: string | null) =>
        value == null || value.trim() === "";

    if (isBlank(userProfile.first_name)) {
        missing.push("First name");
    }
    if (isBlank(userProfile.last_name)) {
        missing.push("Last name");
    }
    if (isBlank(userProfile.email)) {
        missing.push("Email");
    }
    if (isBlank(userProfile.emergency_contact)) {
        missing.push("Emergency contact");
    }
    // Age is required for volunteers who are not marked as over eighteen.
    if (
        !userProfile.over_eighteen &&
        (userProfile.age == null || `${userProfile.age}`.trim() === "")
    ) {
        missing.push("Age");
    }

    return missing;
};

