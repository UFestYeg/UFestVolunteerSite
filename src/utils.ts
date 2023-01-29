import { IEventDate } from "./store/types";

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
