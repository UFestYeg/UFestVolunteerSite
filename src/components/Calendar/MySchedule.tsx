import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography,
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
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch } from "react-redux";
import { UserUrls } from "../../constants";
import { volunteer as volunteerActions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import { CustomForm } from "../Form";
import CalendarToolbar from "./CalendarToolbar";
import UFestWeek from "./UFestWeek";
import { IUserRequest } from "../../store/types";
import { RequestEvent, customRequestStyle } from "./RequestEvent";

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

const MySchedule: React.FC<ScheduleProps> = ({ requests }: ScheduleProps) => {
    const dispatch = useDispatch();
    const [currentList, setList] = useState<UserRequestType[]>([]);

    const token = StateHooks.useToken();

    useEffect(() => {
        if (token) {
            dispatch(volunteerActions.getVolunteerCategoryTypes());
            axios.defaults.headers = {
                Authorization: token,
                "Content-Type": "application/json",
            };

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
    }, [token]);

    const localizer = momentLocalizer(moment);

    return (
        <Container maxWidth="lg">
            <Calendar
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
                            categoryView={false}
                            filter={false}
                            addButton={false}
                        />
                    ),
                    event: RequestEvent,
                }}
                selectable
                popup={true}
                scrollToTime={moment("08:00:00 am", "hh:mm:ss a").toDate()}
                eventPropGetter={customRequestStyle}
            />
        </Container>
    );
};

export default MySchedule;
