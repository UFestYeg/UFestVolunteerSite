import axios from "axios";
import React, { useEffect, useState } from "react";
import { StateHooks } from "../../store/hooks";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import UFestWeek from "./UFestWeek";
import CalendarToolbar from "./CalendarToolbar";
import { Container } from "@material-ui/core";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

type ScheduleEventType = {
    id: number;
    title: string;
    start_time: string | Date;
    end_time: string | Date;
    allDay?: boolean;
    resource?: any;
    number_of_slots?: number;
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
    const [currentList, setList] = useState<ScheduleEventType[]>([]);
    const [draggedEvent, setDraggedEvent] = useState<ScheduleEventType | null>(
        null
    );
    const [displayDragItemInCell, setDisplayDragItemInCell] = useState<boolean>(
        true
    );
    const token = StateHooks.useToken();

    useEffect(() => {
        if (token && process.env["REACT_APP_API_URI"] !== undefined) {
            axios.defaults.headers = {
                Authorization: token,
                "Content-Type": "application/json",
            };

            axios
                .get(`${process.env["REACT_APP_API_URI"]}api/events`)
                .then((res) => {
                    var data = res.data;
                    var mappedData = data.map((d: any) => {
                        d.start_time = new Date(d.start_time);
                        d.end_time = new Date(d.end_time);
                        return d;
                    });
                    setList(mappedData);
                    console.log(mappedData);
                });
        }
    }, [token]);

    const onEventResize = (data: DragAndDropData) => {
        const { start, end, event } = data;
        console.log(start, end);
        const nextEvents = currentList.map((existingEvent) => {
            return existingEvent.id == event.id
                ? { ...existingEvent, start_time: start, end_time: end }
                : existingEvent;
        });
        setList(nextEvents);
    };

    const handleDragStart = (data: DragStartArgs) => {
        const { event } = data;
        setDraggedEvent(event);
    };

    const dragFromOutsideItem = () => {
        return draggedEvent;
    };

    const onDropFromOutside = (data: DragAndDropData) => {
        const { start, end, allDay } = data;
        if (draggedEvent) {
            const event: ScheduleEventType = {
                id: draggedEvent.id,
                title: draggedEvent.title,
                start_time: start,
                end_time: end,
                allDay,
            };

            setDraggedEvent(null);
            moveEvent({ event, start, end, allDay });
        }
    };

    const moveEvent = (data: DragAndDropData) => {
        const { event, start, end, allDay: droppedOnAllDaySlot } = data;
        let allDay = event.allDay;

        if (!event.allDay && droppedOnAllDaySlot) {
            allDay = true;
        } else if (event.allDay && !droppedOnAllDaySlot) {
            allDay = false;
        }

        const nextEvents = currentList.map((existingEvent) => {
            return existingEvent.id == event.id
                ? { ...existingEvent, start_time: start, end_time: end, allDay }
                : existingEvent;
        });

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
                defaultView="week"
                defaultDate={new Date(2021, 4, 21)}
                views={{ day: true, week: UFestWeek }}
                components={{ toolbar: CalendarToolbar }}
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
            />
        </Container>
    );
};

export default EventsCalendar;
