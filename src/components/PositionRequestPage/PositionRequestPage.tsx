import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Container,
    IconButton,
    List,
    ListItem,
    Popover,
    Typography,
} from "@mui/material";
// tslint:disable-next-line: no-submodule-imports
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import { Cancel } from "@mui/icons-material";
import axios from "axios";
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
import { enqueueSnackbar } from "notistack";
import { StateHooks } from "../../store/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { VolunteerUrls } from "../../constants";
import { volunteer as volunteerActions } from "../../store/actions";
import { getEarliestDate } from "../../utils";
import { CalendarToolbar, UFestDay, UFestWeek } from "../Calendar";
import { Loading } from "../Loading";

type ScheduleEventType = {
    id: number;
    title: string;
    start_time: string | Date;
    end_time: string | Date;
    allDay?: boolean;
    resource?: any;
    category_type: any;
    description?: string;
};

type DragAndDropData = {
    event: ScheduleEventType;
    start: string | Date;
    end: string | Date;
    allDay: boolean;
};

type DragStartArgs = {
    event: ScheduleEventType;
    action: "resize" | "move";
    direction: "UP" | "DOWN" | "LEFT" | "RIGHT";
};

const useStyles = makeStyles()((theme) =>
    ({
        calendarWrapper: {
            // RBC hides the day header in single-day (day) view by default,
            // which leaves an empty bar. Show it instead.
            "& .rbc-time-header-cell-single-day": {
                display: "flex",
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
        card: {
            transition: "0.3s",
            boxShadow: "0px 14px 80px rgba(34, 35, 58, 0.2)",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            textAlign: "center",
            margin: 8,
            color: theme.palette.primary.dark,
            justifyContent: "center",
        },
        cardContent: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
        },
        cardHeader: {
            width: "inherit",
        },
        eventRoot: {
            height: "inherit",
        },
        myEvent: {
            "&:hover": {
                minHeight: "20%",
                minWidth: "fit-content",
                zIndex: 1000,
            },
        },
        typography: {
            padding: theme.spacing(2),
        },
    })
);

const PositionRequestPage: React.FC = () => {
    const theme = useTheme();
    const { classes } = useStyles();
    const dispatch = StateHooks.useAppDispatch();
    const navigate = useNavigate();
    const { categoryTypeID: categoryTypeIDStr, roleID: roleIDStr } = useParams<{
        categoryTypeID?: string;
        roleID?: string;
    }>();
    const categoryTypeID = categoryTypeIDStr
        ? parseInt(categoryTypeIDStr, 10)
        : NaN;
    const roleID = roleIDStr ? parseInt(roleIDStr, 10) : undefined;
    const [_categories, loading, _error] = StateHooks.useVolunteerInfo();
    const eventDatesLoading = StateHooks.useEventDatesLoading();
    const userProfile = StateHooks.useUserProfile();
    const [cookies, _setCookie] = useCookies(["csrftoken"]);
    const [currentList, setList] = useState<ScheduleEventType[]>([]);

    const token = StateHooks.useToken();
    const eventDates = StateHooks.useEventDates();
    const earliest = getEarliestDate(eventDates);
    console.log(`early ${earliest}`);

    useEffect(() => {
        if (token && !isNaN(categoryTypeID)) {
            dispatch(
                volunteerActions.getVolunteerCategoryTypes(cookies.csrftoken)
            );
            dispatch(volunteerActions.getEventDates(cookies.csrftoken));
            axios.defaults.headers.common["Authorization"] = `Token ${token}`;
            axios.defaults.headers.common["Content-Type"] =
                "application/json";
            axios.defaults.headers.common["X-CSRFToken"] = cookies.csrftoken;

            axios
                .get(
                    roleID != undefined
                        ? VolunteerUrls.CATEGORIES_WITH_ROLE_LIST(
                              categoryTypeID,
                              roleID
                          )
                        : VolunteerUrls.CATEGORIES_OF_TYPE_LIST(categoryTypeID)
                )
                .then((res) => {
                    const data = res.data;

                    let mappedData;
                    if (roleID != undefined) {
                        const category = data.pop();
                        // In this case we only look at one of the event roles that matches the name received from the badckend
                        mappedData = data.map((d: any) => {
                            const role = d.roles.find(
                                (r: any) =>
                                    r.title.toLowerCase() ===
                                    category.role_title.toLowerCase()
                            );
                            d.role = JSON.parse(JSON.stringify(role));
                            d.role.category = d.role.category
                                    ? { ...d.role.category, title: d.title }
                                    : { title: d.title };
                            d.start_time = new Date(d.start_time);
                            d.end_time = new Date(d.end_time);
                            return d;
                        });
                    } else {
                        // In this case we look at tall the roles under an event
                        mappedData = data.reduce(
                            (accum: any, d: any) =>
                                accum.concat(
                                    ...d.roles.map((r: any) => {
                                        r.role = JSON.parse(JSON.stringify(r));
                                        r.title = d.title;
                                        r.start_time = new Date(d.start_time);
                                        r.end_time = new Date(d.end_time);
                                        return r;
                                    })
                                ),
                            []
                        );
                    }
                    console.log("mappedData");
                    console.log(mappedData);
                    setList(mappedData);
                })
                .catch((err) => console.error(err));
        }
    }, [categoryTypeID, dispatch, roleID, token, cookies.csrftoken]);

    const customEventStyle: EventPropGetter<ScheduleEventType> = (
        event: ScheduleEventType,
        start: string | Date,
        end: string | Date,
        isSelected: boolean
    ) => {
        return { className: clsx("rbc-event", classes.myEvent) };
    };

    const Event = ({ event }: { event: any }) => {
        const [requestError, setRequestError] = useState<any>();
        const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(
            null
        );

        const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
            setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
            setAnchorEl(null);
        };

        const handleSubmit = (role: any) => {
            if (moment(event.start_time).year() < moment().year()) {
                enqueueSnackbar(
                    "This event is from a previous year. The website might not be updated yet. Send an email to volunteerufest@gmail.com to confirm availability.",
                    { variant: "warning", autoHideDuration: 10000 }
                );
            }

            axios
                .post(VolunteerUrls.REQUESTS, {
                    status: "PENDING",
                    user: userProfile.pk,
                    role,
                })
                .then((res) => {
                    console.log(res);
                    navigate("/volunteer", {
                        state: {
                            fromRequestPage: true,
                            title: role.title,
                        },
                    });
                    enqueueSnackbar(`Request submitted for ${role.title}`, {
                        variant: "success",
                    });
                })
                .catch((err) => {
                    let errDetail = "Please try again.";
                    setRequestError(err);
                    if (err.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        console.log(err.response.data);
                        console.log(err.response.status);
                        console.log(err.response.headers);
                        errDetail = err.response.data.detail;
                    } else if (err.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        console.log(err.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log("Error", err.message);
                    }
                    console.log(err.config);
                    console.error(err);
                    enqueueSnackbar(
                        `Could not submit request. ${errDetail}`,
                        { variant: "error" }
                    );
                });
        };

        const handleSubmitClick = () => handleSubmit(selectedRole);

        const errorMessage =
            requestError &&
            requestError.response.data &&
            requestError.response.data.detail ? (
                <Typography variant="body1" color="error">
                    {requestError.response.data.detail}
                </Typography>
            ) : null;

        const open = Boolean(anchorEl);
        const id = open ? "simple-popover" : undefined;
        const selectedRole = event.role;

        const noPositionsLeft =
            selectedRole === undefined ||
            selectedRole?.number_of_open_positions === 0;

        return <>
            <Container onClick={handleClick} className={classes.eventRoot}>
                {errorMessage}
                <strong>{event.title}</strong> : {event.role.title}
                <br />
                Available Positions:{" "}
                {selectedRole?.number_of_positions != null &&
                selectedRole?.number_of_open_positions != null
                    ? `${selectedRole.number_of_open_positions}/${selectedRole.number_of_positions}`
                    : "N/A"}
            </Container>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    horizontal: "right",
                    vertical: "top",
                }}
                transformOrigin={{
                    horizontal: "center",
                    vertical: "bottom",
                }}
            >
                <Card className={classes.card}>
                    <CardContent className={classes.cardContent}>
                        <CardHeader
                            className={classes.cardHeader}
                            action={
                                <IconButton aria-label="settings" onClick={handleClose} size="large">
                                    <Cancel />
                                </IconButton>
                            }
                            title="Submit Request"
                        />
                        <List dense>
                            <ListItem>
                                category:{" "}
                                {selectedRole.category
                                    ? selectedRole.category.title
                                    : ""}
                            </ListItem>
                            <ListItem>
                                position: {selectedRole.title}
                            </ListItem>
                            <ListItem>
                                start date:{" "}
                                {moment(event.start_time.getTime()).format(
                                    "YYYY-MM-DD hh:mm a"
                                )}
                            </ListItem>
                            <ListItem>
                                end date:{" "}
                                {moment(event.end_time.getTime()).format(
                                    "YYYY-MM-DD hh:mm a"
                                )}
                            </ListItem>
                        </List>
                        <CardActions disableSpacing>
                            <Button
                                aria-label="add to favorites"
                                onClick={handleSubmitClick}
                                disabled={noPositionsLeft}
                            >
                                {noPositionsLeft
                                    ? "No positions left"
                                    : "Submit"}
                            </Button>
                            <Button
                                aria-label="share"
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                        </CardActions>
                    </CardContent>
                </Card>
            </Popover>
        </>;
    };

    const localizer = momentLocalizer(moment);

    return (
        <Container>
            {loading || eventDatesLoading ? (
                <Loading />
            ) : (
                <Calendar<ScheduleEventType, object>
                    className={classes.calendarWrapper}
                    localizer={localizer}
                    events={currentList}
                    startAccessor="start_time"
                    endAccessor="end_time"
                    style={{ height: 600 }}
                    defaultView={roleID != undefined ? "week" : "day"}                    defaultDate={earliest ?? new Date()}
                    views={{ day: UFestDay, week: UFestWeek }}
                    components={{
                        event: Event,
                        toolbar: (
                            props: ToolbarProps<ScheduleEventType, object>
                        ) => (
                            <CalendarToolbar
                                {...props}
                                addButton={false}
                                categoryView={false}
                                filter={false}
                            />
                        ),
                    }}
                    selectable
                    popup={true}
                    scrollToTime={moment("08:00:00 am", "hh:mm:ss a").toDate()}
                    eventPropGetter={customEventStyle}
                />
            )}
        </Container>
    );
};

export default PositionRequestPage;
