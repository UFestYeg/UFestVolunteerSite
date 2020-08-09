import * as Moment from "moment";
import { extendMoment } from "moment-range";

import React from "react";
import { NavigateAction, TitleOptions } from "react-big-calendar";
import TimeGrid from "react-big-calendar/lib/TimeGrid";

const moment = extendMoment(Moment);

const UFEST_VOLUNTEERING_START_DATE = new Date("May 19, 2021");
const UFEST_VOLUNTEERING_END_DATE = new Date("May 23, 2021");

class UFestWeek extends React.Component<{ date: Date }> {
    range = (date: Date) =>
        Array.from(
            moment.range(date, moment(date).add(1, "d")).by("day")
        ).map((m) => m.toDate());

    static navigate = (date: Date, action: NavigateAction) => {
        switch (action) {
            case "PREV":
                if (moment(date).isAfter(UFEST_VOLUNTEERING_START_DATE)) {
                    console.log("prev");
                    return moment(date).subtract(1, "d").toDate();
                } else {
                    return date;
                }
            case "NEXT":
                if (moment(date).isBefore(UFEST_VOLUNTEERING_END_DATE)) {
                    console.log("next");
                    return moment(date).add(1, "d").toDate();
                } else {
                    return date;
                }
            default:
                return date;
        }
    };
    static title = (date: Date, options: TitleOptions) => {
        return `UFest Volunteer Schedule: ${UFEST_VOLUNTEERING_START_DATE.toLocaleDateString()} to ${UFEST_VOLUNTEERING_END_DATE.toLocaleDateString()}`;
    };

    render() {
        let { date } = this.props;
        let range = this.range(date);
        return (
            <TimeGrid
                {...this.props}
                range={range}
                onNavigate={UFestWeek.navigate}
            />
        );
    }
}

export default UFestWeek;
