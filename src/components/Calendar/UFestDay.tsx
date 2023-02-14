import * as Moment from "moment";
import { extendMoment } from "moment-range";

import React from "react";
import { NavigateAction, TitleOptions } from "react-big-calendar";
import TimeGrid from "react-big-calendar/lib/TimeGrid";
import { connect } from "react-redux";
import { IEventDate, State } from "../../store/types";
import { getEarliestDate, getLatestDate } from "../../utils";

const moment = extendMoment(Moment);

let UFEST_VOLUNTEERING_START_DATE = new Date(new Date().getFullYear(), 4, 25);
let UFEST_VOLUNTEERING_END_DATE = new Date(new Date().getFullYear(), 4, 29);

function mapStateToProps(state: State) {
    const { volunteer } = state;
    return { eventDates: volunteer.eventDates };
}

class UFestDay extends React.Component<{
    date: Date;
    eventDates: IEventDate[];
}> {
    range = (date: Date) => [date];

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
        return `UFest Volunteer Schedule: ${date.toLocaleDateString()}`;
    };

    render() {
        let { date, eventDates } = this.props;
        let range = this.range(date);

        const earliest = getEarliestDate(eventDates);
        const latest = getLatestDate(eventDates);

        if (earliest) {
            UFEST_VOLUNTEERING_START_DATE = earliest;
        }
        if (latest) {
            UFEST_VOLUNTEERING_END_DATE = latest;
        }
        return (
            <TimeGrid
                {...this.props}
                range={range}
                onNavigate={UFestDay.navigate}
            />
        );
    }
}

export default connect(mapStateToProps)(UFestDay);
