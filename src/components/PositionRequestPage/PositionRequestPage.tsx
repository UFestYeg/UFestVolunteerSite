import {
    Button,
    Card,
    CardActions,
    CardContent,
    Container,
    Grid,
    Popover,
    Typography,
    CardHeader,
    IconButton,
    List,
    ListItem,
} from "@material-ui/core";
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
    Calendar,
    momentLocalizer,
    ToolbarProps,
    Views,
} from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { UserUrls, VolunteerUrls } from "../../constants";
import { volunteer as volunteerActions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import { CalendarToolbar, UFestWeek } from "../Calendar";
import { CustomForm } from "../Form";
import { Cancel } from "@material-ui/icons";

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

const useStyles = makeStyles((theme) =>
    createStyles({
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
        typography: {
            padding: theme.spacing(2),
        },
    })
);

const PositionRequestPage: React.FC = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();
    const { categoryTypeID, roleID } = useParams();
    const [currentList, setList] = useState<ScheduleEventType[]>([]);
    const [currentCategory, setCategory] = useState<string>("");
    const [draggedEvent, setDraggedEvent] = useState<ScheduleEventType | null>(
        null
    );
    const [displayDragItemInCell, setDisplayDragItemInCell] = useState<boolean>(
        true
    );
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const token = StateHooks.useToken();

    useEffect(() => {
        if (token) {
            dispatch(volunteerActions.getVolunteerCategoryTypes());
            axios.defaults.headers = {
                Authorization: token,
                "Content-Type": "application/json",
            };

            axios
                .get(
                    VolunteerUrls.CATEGORIES_WITH_ROLE_LIST(
                        categoryTypeID,
                        roleID
                    )
                )
                .then((res) => {
                    const data = res.data;
                    const category = data.pop();
                    setCategory(category.role_title);

                    const mappedData = data.map((d: any) => {
                        d.start_time = new Date(d.start_time);
                        d.end_time = new Date(d.end_time);
                        return d;
                    });
                    setList(mappedData);
                    console.log(mappedData);
                });
        }
    }, [categoryTypeID, dispatch, roleID, token]);

    const updateEvent = (
        event: ScheduleEventType,
        start: string | Date,
        end: string | Date
    ) => {
        if (token) {
            axios.defaults.headers = {
                Authorization: token,
                "Content-Type": "application/json",
            };
            axios
                .put(UserUrls.POSITION_DETAILS(event.id), {
                    ...event,
                    start_time: start,
                    end_time: end,
                })
                .then((res) => console.log(res))
                .catch((err) => console.error(err));
        }
    };

    const onEventResize = (data: DragAndDropData) => {
        const { start, end, event } = data;
        console.log(start, end);
        const nextEvents = currentList.map((existingEvent) => {
            return existingEvent.id === event.id
                ? { ...existingEvent, start_time: start, end_time: end }
                : existingEvent;
        });
        updateEvent(event, start, end);
        setList(nextEvents);
    };

    const handleDragStart = (data: DragStartArgs) => {
        const { event } = data;
        setDraggedEvent(event);
    };

    // const dragFromOutsideItem = () => {
    //     return draggedEvent;
    // };

    // const onDropFromOutside = (data: DragAndDropData) => {
    //     const { start, end, allDay } = data;
    //     if (draggedEvent) {
    //         const event: ScheduleEventType = {
    //             id: draggedEvent.id,
    //             title: draggedEvent.title,
    //             start_time: start,
    //             end_time: end,
    //             allDay,
    //         };

    //         setDraggedEvent(null);
    //         moveEvent({ event, start, end, allDay });
    //     }
    // };

    const moveEvent = (data: DragAndDropData) => {
        const { event, start, end, allDay: droppedOnAllDaySlot } = data;
        let allDay = event.allDay;

        if (!event.allDay && droppedOnAllDaySlot) {
            allDay = true;
        } else if (event.allDay && !droppedOnAllDaySlot) {
            allDay = false;
        }

        const nextEvents = currentList.map((existingEvent) => {
            return existingEvent.id === event.id
                ? { ...existingEvent, start_time: start, end_time: end, allDay }
                : existingEvent;
        });
        updateEvent(event, start, end);
        setList(nextEvents);
    };

    const Event = ({ event }: { event: any }) => {
        const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(
            null
        );

        const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
            setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
            setAnchorEl(null);
        };

        const open = Boolean(anchorEl);
        const id = open ? "simple-popover" : undefined;
        const selectedRole = event.roles.find(
            (e: any) => e.title === currentCategory
        );
        return (
            <>
                <Container onClick={handleClick}>
                    <strong>{event.title}</strong>
                    <br />
                    {selectedRole.number_of_positions &&
                        "Available Positions:  " +
                            selectedRole.number_of_positions}
                </Container>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    transformOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                    }}
                >
                    <Card className={classes.card}>
                        <CardContent className={classes.cardContent}>
                            <CardHeader
                                action={
                                    <IconButton
                                        aria-label="settings"
                                        onClick={handleClose}
                                    >
                                        <Cancel />
                                    </IconButton>
                                }
                                title="Submit Request"
                            />
                            <List dense>
                                <ListItem>
                                    category:{" "}
                                    {event.category_type
                                        ? event.category_type.tag
                                        : ""}
                                </ListItem>
                                <ListItem>
                                    position: {selectedRole.title}
                                </ListItem>
                                <ListItem>
                                    start date: {event.start_time.getTime()}
                                </ListItem>
                                <ListItem>
                                    end date: {event.end_time.getTime()}
                                </ListItem>
                            </List>
                            <CardActions disableSpacing>
                                <Button aria-label="add to favorites">
                                    Submit
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
            </>
        );
    };

    const localizer = momentLocalizer(moment);
    const DnDCalendar = withDragAndDrop(Calendar);

    return (
        <Container maxWidth="lg">
            <DnDCalendar
                localizer={localizer}
                events={currentList}
                startAccessor="start_time"
                endAccessor="end_time"
                style={{ height: 600 }}
                defaultView="week"
                defaultDate={new Date(2021, 4, 21)}
                views={{ day: true, week: UFestWeek }}
                components={{
                    event: Event,
                    toolbar: (props: ToolbarProps) => (
                        <CalendarToolbar
                            {...props}
                            openModal={() => setModalOpen(true)}
                        />
                    ),
                }}
                onEventDrop={moveEvent}
                onEventResize={onEventResize}
                resizable
                selectable
                popup={true}
                // dragFromOutsideItem={
                //     displayDragItemInCell ? dragFromOutsideItem : null
                // }
                // onDropFromOutside={onDropFromOutside}
                onDragStart={handleDragStart}
                scrollToTime={moment("08:00:00 am", "hh:mm:ss a").toDate()}
            />
        </Container>
    );
};

export default PositionRequestPage;
