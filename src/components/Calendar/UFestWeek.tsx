import moment from "./extendedMoment";

import React from "react";
import { NavigateAction, TitleOptions } from "react-big-calendar";
import TimeGrid from "react-big-calendar/lib/TimeGrid";
import { connect } from "react-redux";
import { IEventDate, State } from "../../store/types";
import { getEarliestDate, getLatestDate } from "../../utils";

let UFEST_VOLUNTEERING_START_DATE = new Date(new Date().getFullYear(), 4, 25);
let UFEST_VOLUNTEERING_END_DATE = new Date(new Date().getFullYear(), 4, 29);

function mapStateToProps(state: State) {
    const { volunteer } = state;
    return { eventDates: volunteer.eventDates };
}

class UFestWeek extends React.Component<{
    date: Date;
    eventDates: IEventDate[];
    localizer?: any;
    min?: Date;
    max?: Date;
    scrollToTime?: Date;
}> {
    range = (date: Date) =>
        Array.from(moment.range(date, moment(date).add(1, "d")).by("day")).map(
            (m) => m.toDate()
        );

    static navigate = (date: Date, action: NavigateAction) => {
        switch (action) {
            case "PREV":
                if (moment(date).isAfter(UFEST_VOLUNTEERING_START_DATE)) {
                    return moment(date).subtract(1, "d").toDate();
                } else {
                    return date;
                }
            case "NEXT":
                if (moment(date).isBefore(UFEST_VOLUNTEERING_END_DATE)) {
                    return moment(date).add(1, "d").toDate();
                } else {
                    return date;
                }
            default:
                return date;
        }
    };
    static title = (date: Date, options: TitleOptions) => {
        return `UFest Volunteer Schedule: ${date.toLocaleDateString()} to ${moment(
            date
        )
            .add(1, "d")
            .toDate()
            .toLocaleDateString()}`;
    };

    render() {
        let { date, eventDates, localizer } = this.props;
        let range = this.range(date);

        const earliest = getEarliestDate(eventDates);
        const latest = getLatestDate(eventDates);

        if (earliest) {
            UFEST_VOLUNTEERING_START_DATE = earliest;
        }
        if (latest) {
            UFEST_VOLUNTEERING_END_DATE = latest;
        }

        // react-big-calendar 1.x no longer defaults min/max on TimeGrid; its
        // own Day/Week views compute them from the localizer before rendering.
        // Replicate that here, otherwise the time grid renders zero slots.
        const min = this.props.min ?? localizer.startOf(new Date(), "day");
        const max = this.props.max ?? localizer.endOf(new Date(), "day");
        const scrollToTime =
            this.props.scrollToTime ?? localizer.startOf(new Date(), "day");

        return (
            <TimeGrid
                {...this.props}
                range={range}
                onNavigate={UFestWeek.navigate}
                min={min}
                max={max}
                scrollToTime={scrollToTime}
            />
        );
    }
}

export default connect(mapStateToProps)(UFestWeek);
