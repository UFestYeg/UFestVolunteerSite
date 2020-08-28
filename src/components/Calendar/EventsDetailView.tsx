// tslint:disable: jsx-no-lambda
// tslint:disable: react-this-binding-issue
// tslint:disable: use-simple-attributes
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@material-ui/core";
// tslint:disable-next-line: no-submodule-imports
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import axios from "axios";
import * as chroma from "chroma-js";
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
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
// tslint:disable-next-line: no-submodule-imports
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
// tslint:disable-next-line: no-submodule-imports
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { VolunteerUrls } from "../../constants";
import { volunteer as volunteerActions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import { CustomForm } from "../Form";
import { Loading } from "../Loading";
import CalendarToolbar from "./CalendarToolbar";
import EventDetail from "./EventDetail";
import UFestWeek from "./UFestWeek";

export type VolunteerCategoryType = {
    id: number;
    title: string;
    start_time: string | Date;
    end_time: string | Date;
    allDay?: boolean;
    resource?: any;
    description?: string;
    roles?: any;
    number_of_positions: number | null;
    category: string;
};

type DragAndDropData = {
    event: VolunteerCategoryType;
    start: string | Date;
    end: string | Date;
    allDay: boolean;
};

const useStyles = makeStyles((theme) =>
    createStyles({
        myEvent: { "&:hover": { zIndex: 1000, minWidth: "fit-content" } },
    })
);

interface IEventsDetailView {
    setCategoryView: React.Dispatch<React.SetStateAction<boolean>>;
    selectedCategories: string[];
    setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
    defaultDate: Date;
    setDefaultDate: React.Dispatch<React.SetStateAction<Date>>;
    selectAll: boolean;
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
}

const EventDetailView: React.FC<IEventsDetailView> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();
    const [currentList, setList] = useState<VolunteerCategoryType[]>([]);
    const [originalList, setOriginalList] = useState<VolunteerCategoryType[]>(
        []
    );
    const [cookies, _setCookie] = useCookies(["csrftoken"]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const token = StateHooks.useToken();
    const [volunteerCategories, loading, error] = StateHooks.useVolunteerInfo();
    const volunteerCategoryTypes = StateHooks.useVolunteerCategoryTypes();
    const volunteerCategoryTypeTags = volunteerCategoryTypes.map(
        (categoryType) => {
            return categoryType.tag;
        }
    );

    const colours = chroma
        .scale(["ff595e", "ffca3a", "8ac926", "1982c4", "6a4c93"])
        .colors(volunteerCategoryTypeTags.length);
    const colourMap = new Map<string, any>();
    volunteerCategoryTypeTags.map((c: string, i: number) => {
        colourMap.set(c, { backgroundColor: colours[i] });
    });

    useEffect(() => {
        dispatch(volunteerActions.getVolunteerCategoryTypes(cookies.csrftoken));
        dispatch(volunteerActions.getVolunteerCategories(cookies.csrftoken));
    }, [cookies, dispatch]);

    useEffect(() => {
        props.setSelectedCategories(volunteerCategoryTypeTags);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [volunteerCategoryTypes]);

    // Filtering
    useEffect(() => {
        const newList = originalList.filter((e) => {
            if (e.category !== undefined) {
                return props.selectedCategories.indexOf(e.category) > -1;
            }
        });
        setList(newList);
    }, [originalList, props.selectedCategories]);

    useEffect(() => {
        const mappedData = volunteerCategories.map((d: any) => {
            d.start_time = new Date(d.start_time);
            d.end_time = new Date(d.end_time);
            d.category = d.category_type.tag;
            d.resourceId = d.category_type.id;
            return d;
        });
        setList(mappedData);
        setOriginalList(mappedData);
    }, [volunteerCategories]);

    const updateEvent = (
        event: VolunteerCategoryType,
        start: string | Date,
        end: string | Date
    ) => {
        axios.defaults.headers = {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
            "X-CSRFToken": cookies.csrftoken,
        };
        if (token && process.env.REACT_APP_API_URI !== undefined) {
            axios
                .put(VolunteerUrls.CATEGORY_DETAILS(event.id), {
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

    const customEventStyle: EventPropGetter<VolunteerCategoryType> = (
        event: VolunteerCategoryType,
        start: string | Date,
        end: string | Date,
        isSelected: boolean
    ) => {
        if (event.category !== undefined) {
            return {
                style: colourMap.get(event.category),
                className: classes.myEvent,
            };
        } else {
            return { className: clsx("rbc-event", classes.myEvent) };
        }
    };

    const WrappedEventDetail = ({ event }: { event: any }) => {
        return (
            <EventDetail
                event={event}
                setCategoryView={props.setCategoryView}
                setSelectedCategories={props.setSelectedCategories}
                setDefaultDate={props.setDefaultDate}
            />
        );
    };

    const localizer = momentLocalizer(moment);
    const DnDCalendar = withDragAndDrop(Calendar);
    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <Typography color="error">
                        {error && error.reponse ? error.reponse.data : null}
                    </Typography>
                    <DnDCalendar
                        localizer={localizer}
                        events={currentList}
                        startAccessor="start_time"
                        endAccessor="end_time"
                        style={{ height: 600 }}
                        defaultView="day"
                        defaultDate={props.defaultDate}
                        views={{ day: true, week: UFestWeek }}
                        components={{
                            event: WrappedEventDetail,
                            toolbar: (tbarProps: ToolbarProps) => (
                                <CalendarToolbar
                                    {...tbarProps}
                                    openModal={() => setModalOpen(true)}
                                    showCategoryView={false}
                                    switchChange={() =>
                                        props.setCategoryView(
                                            (oldCategoryView) =>
                                                !oldCategoryView
                                        )
                                    }
                                    categoryView={true}
                                    addButton={true}
                                    filter={true}
                                    options={volunteerCategoryTypeTags}
                                    selectedOptions={props.selectedCategories}
                                    setSelectedCategories={
                                        props.setSelectedCategories
                                    }
                                    selectAll={props.selectAll}
                                    setSelectAll={props.setSelectAll}
                                />
                            ),
                        }}
                        onEventDrop={moveEvent}
                        onEventResize={onEventResize}
                        resizable
                        selectable
                        popup={true}
                        scrollToTime={moment(
                            "08:00:00 am",
                            "hh:mm:ss a"
                        ).toDate()}
                        eventPropGetter={customEventStyle}
                        min={moment("07:00:00 am", "hh:mm:ss a").toDate()}
                    />
                    <Dialog
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}
                        aria-labelledby="form-dialog-title"
                    >
                        <DialogActions>
                            <Button
                                onClick={() => setModalOpen(false)}
                                color="primary"
                            >
                                Cancel
                            </Button>
                        </DialogActions>
                        <DialogTitle id="form-dialog-title">
                            Create Event
                        </DialogTitle>
                        <DialogContent>
                            <CustomForm
                                requestTypeProp="POST"
                                buttonText="Create"
                            />
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </>
    );
};

export default EventDetailView;
