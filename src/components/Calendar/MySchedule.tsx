import { Box, Button, Container } from "@mui/material";
// tslint:disable-next-line: no-submodule-imports
import { useTheme } from "@mui/material/styles";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { makeStyles } from "tss-react/mui";
import clsx from "clsx";
import axios from "axios";
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
import { StateHooks } from "../../store/hooks";
import { volunteer as volunteerActions } from "../../store/actions";
import { notifyApiError, setAuthHeaders } from "../../store/actions/apiUtils";
import VolunteerUrls from "../../constants/volunteerUrls";
import { IUserRequest } from "../../store/types";
import CalendarToolbar from "./CalendarToolbar";
import { RequestEvent } from "./RequestEvent";
import { hoverExpandStyle } from "./eventHover";
import { getEarliestDate } from "../../utils";
import UFestWeek from "./UFestWeek";
import UFestDay from "./UFestDay";
import { Loading } from "../Loading";

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

const useStyles = makeStyles()((theme) =>
    ({
        calendarWrapper: {
            // RBC hides the day header in single-day (day) view by default,
            // which leaves an empty bar. Show it instead.
            "& .rbc-time-header-cell-single-day": {
                display: "flex",
            },
            // RBC styles day/week events with `flex-flow: column wrap`, so on
            // hover (when the body grows tall) the content wraps into a second
            // column to the right of the time label and overflows the card.
            // This is a plain (non-DnD) Calendar, so it's vulnerable; force
            // nowrap. The `.rbc-day-slot` ancestor keeps the selector more
            // specific than RBC's own `.rbc-day-slot .rbc-event` rule.
            "& .rbc-day-slot .rbc-event": {
                flexWrap: "nowrap",
            },
            "& .rbc-header": {
                height: "auto",
                minHeight: "fit-content",
                lineHeight: "normal",
                overflow: "visible",
                padding: theme.spacing(0.75, 0.5),
                whiteSpace: "normal",
            },
            "& .rbc-header .rbc-button-link, & .rbc-header span": {
                fontSize: "1rem",
                fontWeight: 500,
            },
        },
        myEvent: {
            "& .rbc-event-label": {
                whiteSpace: "normal",
                paddingRight: theme.spacing(2.5),
            },
            ...hoverExpandStyle,
        },
    })
);

const MySchedule: React.FC<ScheduleProps> = ({ requests }: ScheduleProps) => {
    const theme = useTheme();
    const { classes } = useStyles();
    const dispatch = StateHooks.useAppDispatch();
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

    const hasAcceptedShifts = currentList.some(
        (event) => event.status === "ACCEPTED"
    );

    const handleExportCalendar = async () => {
        try {
            setAuthHeaders(token, cookies.csrftoken);
            const response = await axios.get(VolunteerUrls.MY_SCHEDULE_ICS, {
                responseType: "blob",
            });
            const downloadUrl = window.URL.createObjectURL(
                new Blob([response.data], { type: "text/calendar" })
            );
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", "ufest-volunteer-schedule.ics");
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            notifyApiError(error, "Could not export your schedule.");
        }
    };

    const earliest = getEarliestDate(eventDates) ?? new Date();
    return (
        <Container maxWidth="xl" className={classes.calendarWrapper}>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mb: 1,
                        }}
                    >
                        <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            startIcon={<EventAvailableIcon />}
                            onClick={handleExportCalendar}
                            disabled={!hasAcceptedShifts}
                            sx={{
                                fontSize: "0.7rem",
                                py: 0.25,
                                "& .MuiButton-startIcon > *:nth-of-type(1)": {
                                    fontSize: "1rem",
                                },
                            }}
                        >
                            Add to calendar
                        </Button>
                    </Box>
                    <Calendar<UserRequestType, object>
                        localizer={localizer}
                        events={currentList}
                        startAccessor="start_time"
                        endAccessor="end_time"
                        style={{ height: "calc(100vh - 200px)", minHeight: 600 }}
                        defaultView="day"
                        defaultDate={earliest}
                        views={{ day: UFestDay, week: UFestWeek }}
                        components={{
                            event: RequestEvent,
                            toolbar: (
                                props: ToolbarProps<UserRequestType, object>
                            ) => (
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
                        scrollToTime={moment(
                            "08:00:00 am",
                            "hh:mm:ss a"
                        ).toDate()}
                        eventPropGetter={customRequestStyle}
                    />
                </>
            )}
        </Container>
    );
};

export default MySchedule;
