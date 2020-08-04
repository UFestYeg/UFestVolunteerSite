import * as Moment from "moment";
import { extendMoment } from "moment-range";

import React from "react";
import { NavigateAction, TitleOptions } from "react-big-calendar";
import TimeGrid from "react-big-calendar/lib/TimeGrid";

const moment = extendMoment(Moment);

const UFEST_VOLUNTEERING_START_DATE = new Date("May 19, 2021");
const UFEST_VOLUNTEERING_END_DATE = new Date("May 23, 2021");

class UFestWeek extends React.Component {
    range = Array.from(
        moment
            .range(UFEST_VOLUNTEERING_START_DATE, UFEST_VOLUNTEERING_END_DATE)
            .by("day")
    ).map((m) => m.toDate());

    static navigate = (date: Date, action: NavigateAction) => {
        switch (action) {
            case "PREV":
                return moment(date).subtract(5, "d").toDate();

            case "NEXT":
                return moment(date).add(5, "d").toDate();

            default:
                return date;
        }
    };
    static title = (date: Date, options: TitleOptions) => {
        return `UFest Volunteer Schedule: ${UFEST_VOLUNTEERING_START_DATE.toLocaleDateString()} to ${UFEST_VOLUNTEERING_END_DATE.toLocaleDateString()}`;
    };

    render() {
        return <TimeGrid {...this.props} range={this.range} />;
    }
}

export default UFestWeek;
