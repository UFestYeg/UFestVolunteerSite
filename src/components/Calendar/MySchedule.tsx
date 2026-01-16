import { Container } from "@material-ui/core";
// tslint:disable-next-line: no-submodule-imports
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
    Calendar,
    EventPropGetter,
    momentLocalizer,
    ToolbarProps,
} from "react-big-calendar";
// tslint:disable-next-line: no-submodule-imports
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { volunteer as volunteerActions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import { IUserRequest } from "../../store/types";
import CalendarToolbar from "./CalendarToolbar";
import { RequestEvent } from "./RequestEvent";
import { getEarliestDate } from "../../utils";
import UFestWeek from "./UFestWeek";
import UFestDay from "./UFestDay";
import { Loading } from "../Loading";
import logger from "../../logger";

type UserRequestType = {
    id: number;
    title: string;
    start_time: string | Date;
    end_time: string | Date;
    allDay?: boolean;
    resource?: any;
    number_of_slots?: number;
    description?: string;
    status: string;
    category: number;
};

type ScheduleProps = {
    requests: IUserRequest[];
};

const styles = {
    accepted: {
        backgroundColor: "#69bb3c",
        border: "2px solid #33691E",
    },
    denied: {
        backgroundColor: "#F44336",
        border: "2px solid #D32F2F",
    },
    pending: {
        backgroundColor: "#ffcc00",
        border: "2px solid #FBC02D",
        color: "black",
    },
    unavailable: {
        backgroundColor: "#BDBDBD",
        border: "2px solid #616161",
        color: "black",
    },
};

const useStyles = makeStyles((theme) =>
    createStyles({
        myEvent: {
            "&:hover": {
                minHeight: "20%",
                minWidth: "fit-content",
                zIndex: 1000,
            },
        },
    })
);

const MySchedule: React.FC<ScheduleProps> = ({ requests }: ScheduleProps) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();
    const [currentList, setList] = useState<UserRequestType[]>([]);
    const [_categories, loading, _error] = StateHooks.useVolunteerInfo();
    const [cookies, _setCookie] = useCookies(["csrftoken"]);

    const token = StateHooks.useToken();
    const eventDates = StateHooks.useEventDates();

    const customRequestStyle: EventPropGetter<UserRequestType> = (
        event: UserRequestType,
        start: string | Date,
        end: string | Date,
        isSelected: boolean
    ) => {
        switch (event.status) {
            case "PENDING":
                return { style: styles.pending, className: classes.myEvent };
            case "ACCEPTED":
                return { style: styles.accepted, className: classes.myEvent };
            case "UNAVAILABLE":
                return {
                    style: styles.unavailable,
                    className: classes.myEvent,
                };
            case "DENIED":
                return { style: styles.denied, className: classes.myEvent };
            default:
                return { className: clsx("rbc-event", classes.myEvent) };
        }
    };

    useEffect(() => {
        if (token) {
            dispatch(
                volunteerActions.getVolunteerCategoryTypes(cookies.csrftoken)
            );
            dispatch(volunteerActions.getEventDates(cookies.csrftoken));

            const mappedRequests = requests.map((r) => {
                return {
                    id: r.id,
                    title: r.role.title,
                    start_time: new Date(r.role.category.start_time),
                    end_time: new Date(r.role.category.end_time),
                    status: r.status,
                    category: r.role.category.category_type,
                };
            });
            setList(mappedRequests);
        }
    }, [token, dispatch, requests]);

    const localizer = momentLocalizer(moment);

    const earliest = getEarliestDate(eventDates) ?? new Date();
    logger.debug(`event dates ${eventDates}`);

    logger.debug(`Earliest date ${earliest}`);
    return (
        <Container maxWidth="lg">
            {loading ? (
                <Loading />
            ) : (
                <Calendar
                    localizer={localizer}
                    events={currentList}
                    startAccessor="start_time"
                    endAccessor="end_time"
                    style={{ height: 600 }}
                    defaultView="day"
                    defaultDate={earliest}
                    views={{ day: UFestDay, week: UFestWeek }}
                    components={{
                        event: RequestEvent,
                        toolbar: (props: ToolbarProps) => (
                            <CalendarToolbar
                                {...props}
                                categoryView={false}
                                filter={false}
                                addButton={false}
                            />
                        ),
                    }}
                    selectable
                    popup={true}
                    scrollToTime={moment("08:00:00 am", "hh:mm:ss a").toDate()}
                    eventPropGetter={customRequestStyle}
                />
            )}
        </Container>
    );
};

export default MySchedule;
