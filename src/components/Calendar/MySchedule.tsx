import { Container } from "@material-ui/core";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, ToolbarProps } from "react-big-calendar";
// tslint:disable-next-line: no-submodule-imports
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch } from "react-redux";
import { volunteer as volunteerActions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import { IUserRequest } from "../../store/types";
import CalendarToolbar from "./CalendarToolbar";
import { customRequestStyle, RequestEvent } from "./RequestEvent";
import UFestWeek from "./UFestWeek";

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
        </Container>
    );
};

export default MySchedule;
