import axios from "axios";
import React, { useEffect, useState } from "react";
import { StateHooks } from "../../store/hooks";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import UFestWeek from "./UFestWeek";
import CalendarToolbar from "./CalendarToolbar";

type ScheduleEventType = {
    id: number;
    title: string;
    start_time: Date;
    end_time: Date;
    allDay?: boolean;
    resource?: any;
    number_of_slots: number;
};

const EventsCalendar: React.FC = () => {
    const [currentList, setList] = useState<ScheduleEventType[]>([]);
    const token = StateHooks.useToken();

    useEffect(() => {
        if (token && process.env["REACT_APP_API_URI"] !== undefined) {
            axios.defaults.headers = {
                Authorization: token,
                "Content-Type": "application/json",
            };

            axios.get(`${process.env["REACT_APP_API_URI"]}api/`).then((res) => {
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

    const localizer = momentLocalizer(moment);

    return (
        <div>
            <Calendar
                localizer={localizer}
                events={currentList}
                startAccessor="start_time"
                endAccessor="end_time"
                style={{ height: 600 }}
                defaultView="week"
                defaultDate={new Date(2021, 4, 21)}
                views={{ day: true, week: UFestWeek }}
                components={{ toolbar: CalendarToolbar }}
            />
        </div>
    );
};

export default EventsCalendar;
