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
import { Close } from "@mui/icons-material";
import axios from "axios";
import chroma from "chroma-js";
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
import { notifyApiError, setAuthHeaders } from "../../store/actions/apiUtils";
import { getEarliestDate } from "../../utils";
import { CalendarToolbar, UFestDay, UFestWeek } from "../Calendar";
import { hoverExpandStyle, useHoverShiftLeft } from "../Calendar/eventHover";
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
            // RBC styles day/week events with `flex-flow: column wrap`. The
            // other calendars use the drag-and-drop addon, which wraps the
            // event body in a `.rbc-addons-dnd-resizable` div so there is
            // nothing to wrap. This page renders a plain `Calendar`, so on
            // hover (when the body grows tall) the content wrapped into a
            // second flex column and jumped to the right of the time label,
            // overflowing the card. Forcing `nowrap` keeps the label and
            // content stacked in a single column, inside the card. The
            // `.rbc-day-slot` ancestor is included so this rule out-specifies
            // RBC's own `.rbc-day-slot .rbc-event` declaration.
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
        card: {
            borderRadius: 16,
            boxShadow: "0 12px 40px rgba(34, 35, 58, 0.18)",
            overflow: "hidden",
            minWidth: 300,
            maxWidth: 360,
            color: theme.palette.text.primary,
        },
        cardHeader: {
            backgroundColor: theme.palette.primary.dark,
            color: theme.palette.primary.contrastText,
            padding: theme.spacing(1.25, 2),
            "& .MuiCardHeader-title": {
                fontSize: "1rem",
                fontWeight: 600,
            },
            "& .MuiCardHeader-action": {
                margin: 0,
                alignSelf: "center",
            },
        },
        closeButton: {
            color: theme.palette.primary.contrastText,
            opacity: 0.85,
            "&:hover": {
                opacity: 1,
                backgroundColor: "rgba(255, 255, 255, 0.12)",
            },
        },
        cardContent: {
            padding: theme.spacing(0.5, 2),
        },
        detailList: {
            padding: 0,
        },
        detailItem: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: theme.spacing(2),
            padding: theme.spacing(0.9, 0),
            borderBottom: `1px solid ${theme.palette.divider}`,
            "&:last-of-type": {
                borderBottom: "none",
            },
        },
        detailLabel: {
            color: theme.palette.text.secondary,
            fontSize: "0.65rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontWeight: 600,
            whiteSpace: "nowrap",
        },
        detailValue: {
            color: theme.palette.text.primary,
            fontSize: "0.85rem",
            fontWeight: 400,
            textAlign: "right",
        },
        cardActions: {
            padding: theme.spacing(1, 2, 1.75),
            justifyContent: "flex-end",
            gap: theme.spacing(1),
            "& .MuiButton-root": {
                fontSize: "0.75rem",
                padding: theme.spacing(0.5, 1.5),
            },
        },
        eventRoot: {
            // Fill the full react-big-calendar event box so the entire card is
            // clickable. The Container otherwise only takes its intrinsic text
            // height, so clicks below the text hit the event box but missed
            // this onClick handler (no popover). `height: 100%` also lets the
            // container fill the expanded card on hover.
            height: "100%",
            // Drop MUI Container's default 24px side gutters (see the
            // `disableGutters`/`maxWidth={false}` props on the Container below).
            // In a narrow event tile those gutters left almost no room for
            // text, so on hover the text was pushed right and overflowed past
            // the card's right edge. A small even padding plus `overflowWrap`
            // keeps the text inside the card and uses the tile's full width.
            // Kept identical to the EventCategory/EventDetail tiles so all
            // calendars behave the same.
            padding: theme.spacing(0.25, 0.75),
            overflowWrap: "break-word",
        },
        myEvent: {
            "& .rbc-event-label": {
                whiteSpace: "normal",
                paddingRight: theme.spacing(2.5),
            },
            ...hoverExpandStyle,
        },
        typography: {
            padding: theme.spacing(2),
        },
    })
);

interface IPositionRequestPageProps {
    // When true, load and display open positions across every category with a
    // category filter, instead of a single pre-selected category. This lets
    // volunteers who only have time restrictions browse the full schedule and
    // pick a slot without choosing a category first.
    allCategories?: boolean;
}

const PositionRequestPage: React.FC<IPositionRequestPageProps> = ({
    allCategories = false,
}) => {
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

    // Category filter (full-calendar mode only).
    const volunteerCategoryTypes = StateHooks.useVolunteerCategoryTypes();
    const categoryTags = volunteerCategoryTypes.map((c) => c.tag);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(true);

    const token = StateHooks.useToken();
    const eventDates = StateHooks.useEventDates();
    const earliest = getEarliestDate(eventDates);

    // Default the category filter to "all selected" once the category types
    // have loaded, so the full calendar starts by showing everything.
    useEffect(() => {
        if (allCategories && categoryTags.length > 0) {
            setSelectedCategories(categoryTags);
        }
    }, [allCategories, volunteerCategoryTypes.length]);

    // Give each category type its own colour, matching the admin calendar so
    // the full-calendar view is easy to scan by category at a glance.
    const colours = chroma
        .scale(["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93"])
        .colors(categoryTags.length);
    const colourMap = new Map<string, any>();
    categoryTags.forEach((tag, i) => {
        colourMap.set(tag, { backgroundColor: colours[i] });
    });

    useEffect(() => {
        if (token && (allCategories || !isNaN(categoryTypeID))) {
            dispatch(
                volunteerActions.getVolunteerCategoryTypes(cookies.csrftoken)
            );
            dispatch(volunteerActions.getEventDates(cookies.csrftoken));
            setAuthHeaders(token, cookies.csrftoken);

            const requestUrl = allCategories
                ? VolunteerUrls.CATEGORY_LIST
                : roleID != undefined
                ? VolunteerUrls.CATEGORIES_WITH_ROLE_LIST(
                      categoryTypeID,
                      roleID
                  )
                : VolunteerUrls.CATEGORIES_OF_TYPE_LIST(categoryTypeID);

            axios
                .get(requestUrl)
                .then((res) => {
                    const data = res.data;

                    let mappedData;
                    if (!allCategories && roleID != undefined) {
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
                        // Every role under every (matching) event. Used for a
                        // single category and for the full-calendar mode.
                        mappedData = data.reduce(
                            (accum: any, d: any) =>
                                accum.concat(
                                    ...d.roles.map((r: any) => {
                                        r.role = JSON.parse(JSON.stringify(r));
                                        // Give the popover a readable category
                                        // label and tag the event with its
                                        // category type so the full-calendar
                                        // filter can match it.
                                        r.role.category = { title: d.title };
                                        r.category_type = d.category_type;
                                        r.title = d.title;
                                        r.start_time = new Date(d.start_time);
                                        r.end_time = new Date(d.end_time);
                                        return r;
                                    })
                                ),
                            []
                        );
                    }
                    setList(mappedData);
                })
                .catch((err) =>
                    notifyApiError(err, "Unable to load positions.")
                );
        }
    }, [categoryTypeID, dispatch, roleID, token, cookies.csrftoken, allCategories]);

    const customEventStyle: EventPropGetter<ScheduleEventType> = (
        event: ScheduleEventType,
        start: string | Date,
        end: string | Date,
        isSelected: boolean
    ) => {
        const tag = event.category_type?.tag;
        return {
            className: clsx("rbc-event", classes.myEvent),
            style: tag ? colourMap.get(tag) : undefined,
        };
    };

    const Event = ({ event }: { event: any }) => {
        const [requestError, setRequestError] = useState<any>();
        const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(
            null
        );
        const containerRef = useHoverShiftLeft<HTMLDivElement>();

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
                .then(() => {
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
                    if (err.response?.data?.detail) {
                        errDetail = err.response.data.detail;
                    }
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
            <Container
                onClick={handleClick}
                className={classes.eventRoot}
                ref={containerRef}
                disableGutters
                maxWidth={false}
            >
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
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: 4,
                            overflow: "visible",
                            backgroundColor: "transparent",
                            boxShadow: "none",
                        },
                    },
                }}
            >
                <Card className={classes.card}>
                    <CardHeader
                        className={classes.cardHeader}
                        action={
                            <IconButton
                                aria-label="close"
                                onClick={handleClose}
                                size="small"
                                className={classes.closeButton}
                            >
                                <Close />
                            </IconButton>
                        }
                        title="Submit Request"
                    />
                    <CardContent className={classes.cardContent}>
                        <List className={classes.detailList}>
                            <ListItem className={classes.detailItem} disableGutters>
                                <span className={classes.detailLabel}>
                                    Category
                                </span>
                                <span className={classes.detailValue}>
                                    {selectedRole.category
                                        ? selectedRole.category.title
                                        : "—"}
                                </span>
                            </ListItem>
                            <ListItem className={classes.detailItem} disableGutters>
                                <span className={classes.detailLabel}>
                                    Position
                                </span>
                                <span className={classes.detailValue}>
                                    {selectedRole.title}
                                </span>
                            </ListItem>
                            <ListItem className={classes.detailItem} disableGutters>
                                <span className={classes.detailLabel}>
                                    Start
                                </span>
                                <span className={classes.detailValue}>
                                    {moment(event.start_time.getTime()).format(
                                        "MMM D, YYYY · h:mm A"
                                    )}
                                </span>
                            </ListItem>
                            <ListItem className={classes.detailItem} disableGutters>
                                <span className={classes.detailLabel}>End</span>
                                <span className={classes.detailValue}>
                                    {moment(event.end_time.getTime()).format(
                                        "MMM D, YYYY · h:mm A"
                                    )}
                                </span>
                            </ListItem>
                        </List>
                    </CardContent>
                    <CardActions className={classes.cardActions}>
                        <Button onClick={handleClose} color="inherit" size="small">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmitClick}
                            disabled={noPositionsLeft}
                            variant="contained"
                            color="primary"
                            size="small"
                            disableElevation
                        >
                            {noPositionsLeft ? "No positions left" : "Submit"}
                        </Button>
                    </CardActions>
                </Card>
            </Popover>
        </>;
    };

    const localizer = momentLocalizer(moment);

    // In full-calendar mode, narrow the events to the selected categories.
    const displayList = allCategories
        ? currentList.filter(
              (e) =>
                  e.category_type != null &&
                  selectedCategories.indexOf(e.category_type.tag) > -1
          )
        : currentList;

    return (
        <Container>
            {allCategories ? (
                <Typography
                    variant="h2"
                    align="center"
                    sx={{ mt: 3, mb: 0.5 }}
                >
                    Browse All Positions
                </Typography>
            ) : null}
            {loading || eventDatesLoading ? (
                <Loading />
            ) : (
                <Calendar<ScheduleEventType, object>
                    className={classes.calendarWrapper}
                    localizer={localizer}
                    events={displayList}
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
                                filter={allCategories}
                                options={categoryTags}
                                selectedOptions={selectedCategories}
                                setSelectedCategories={setSelectedCategories}
                                selectAll={selectAll}
                                setSelectAll={setSelectAll}
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
