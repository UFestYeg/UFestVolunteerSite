import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@material-ui/core";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
    Calendar,
    momentLocalizer,
    ToolbarProps,
    Views,
} from "react-big-calendar";
// tslint:disable-next-line: no-submodule-imports
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
// tslint:disable-next-line: no-submodule-imports
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
// tslint:disable-next-line: no-submodule-imports
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch } from "react-redux";
import { UserUrls } from "../../constants";
import { volunteer as volunteerActions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import { CustomForm } from "../Form";
import CalendarToolbar from "./CalendarToolbar";
import UFestWeek from "./UFestWeek";

type ScheduleEventType = {
    id: number;
    title: string;
    start_time: string | Date;
    end_time: string | Date;
    allDay?: boolean;
    resource?: any;
    number_of_positions?: number;
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

const EventsCalendar: React.FC = () => {
    const dispatch = useDispatch();
    const [currentList, setList] = useState<ScheduleEventType[]>([]);
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

            axios.get(UserUrls.POSITION_LIST).then((res) => {
                const data = res.data;
                const mappedData = data.map((d: any) => {
                    d.start_time = new Date(d.start_time);
                    d.end_time = new Date(d.end_time);
                    return d;
                });
                setList(mappedData);
                console.log(mappedData);
            });
        }
    }, [token]);

    const updateEvent = (
        event: ScheduleEventType,
        start: string | Date,
        end: string | Date
    ) => {
        axios.defaults.headers = {
            Authorization: token,
            "Content-Type": "application/json",
        };
        if (token && process.env.REACT_APP_API_URI !== undefined) {
            axios
                .put(UserUrls.POSITION_DETAILS(event.id), {
                    ...event,
                    end_time: end,
                    start_time: start,
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
                defaultView="day"
                defaultDate={new Date(2021, 4, 22)}
                views={{ day: true, week: UFestWeek }}
                components={{
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
            <Dialog
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="form-dialog-title"
            >
                <DialogActions>
                    <Button onClick={() => setModalOpen(false)} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
                <DialogTitle id="form-dialog-title">Create Event</DialogTitle>
                <DialogContent>
                    <CustomForm requestTypeProp="POST" buttonText="Create" />
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default EventsCalendar;
