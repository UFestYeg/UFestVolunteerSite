// tslint:disable: jsx-no-lambda
// tslint:disable: react-this-binding-issue
// tslint:disable: use-simple-attributes
// tslint:disable: no-submodule-imports
import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@material-ui/core";
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
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
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch } from "react-redux";
import { VolunteerUrls } from "../../constants";
import { volunteer as volunteerActions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import { CustomForm } from "../Form";
import { Loading } from "../Loading";
import CalendarToolbar from "./CalendarToolbar";
import EventCategory, { EventCategoryType } from "./EventCategory";
import UFestWeek from "./UFestWeek";

type DragAndDropData = {
    event: EventCategoryType;
    start: string | Date;
    end: string | Date;
    allDay: boolean;
};

interface IEventsCategoryView {
    setCategoryView: React.Dispatch<React.SetStateAction<boolean>>;
    selectedCategories: string[];
    setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
    defaultDate: Date;
    setDefaultDate: React.Dispatch<React.SetStateAction<Date>>;
}

const useStyles = makeStyles((theme) =>
    createStyles({
        myEvent: {
            "&:hover": {
                minHeight: "20%",
                minWidth: "fit-content",
                zIndex: 1000,
            },
        },
    })
);

const EventsCategoryView: React.FC<IEventsCategoryView> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();
    const [currentList, setList] = useState<EventCategoryType[]>([]);
    const [originalList, setOriginalList] = useState<EventCategoryType[]>([]);

    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const token = StateHooks.useToken();
    const mappedRoles = StateHooks.useMappedRoles();
    const [_categories, loading, error] = StateHooks.useVolunteerInfo();
    const volunteerCategories = StateHooks.useVolunteerCategoryTypes();
    const volunteerCategoryTypes = volunteerCategories.map((categoryType) => {
        return categoryType.tag;
    });

    const colours = chroma
        .scale(["ff595e", "ffca3a", "8ac926", "1982c4", "6a4c93"])
        .colors(volunteerCategoryTypes.length);
    const colourMap = new Map<string, any>();
    volunteerCategoryTypes.map((c: string, i: number) => {
        colourMap.set(c, { backgroundColor: colours[i] });
    });

    useEffect(() => {
        dispatch(volunteerActions.getVolunteerCategoryTypes());
        dispatch(volunteerActions.getMappedVolunteerRoles());
    }, [dispatch]);

    useEffect(() => {
        setList(mappedRoles);
        setOriginalList(mappedRoles);
    }, [mappedRoles]);

    useEffect(() => {
        const newList = originalList.filter((e) => {
            if (e.category !== undefined) {
                return props.selectedCategories.indexOf(e.category) > -1;
            }
        });
        setList(newList);
    }, [originalList, props.selectedCategories]);

    const updateEvent = (
        event: EventCategoryType,
        start: string | Date,
        end: string | Date
    ) => {
        axios.defaults.headers = {
            Authorization: token,
            "Content-Type": "application/json",
        };
        if (token && process.env.REACT_APP_API_URI !== undefined) {
            axios
                .put(VolunteerUrls.CATEGORY_DETAILS(event.eventID), {
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
            return existingEvent.eventID === event.eventID
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
            return existingEvent.eventID === event.eventID
                ? { ...existingEvent, start_time: start, end_time: end, allDay }
                : existingEvent;
        });
        updateEvent(event, start, end);
        setList(nextEvents);
    };

    const customEventStyle: EventPropGetter<EventCategoryType> = (
        event: EventCategoryType,
        start: string | Date,
        end: string | Date,
        isSelected: boolean
    ) => {
        if (event.category !== undefined) {
            return {
                className: classes.myEvent,
                style: colourMap.get(event.category),
            };
        } else {
            return { className: clsx("rbc-event", classes.myEvent) };
        }
    };

    const localizer = momentLocalizer(moment);
    const DnDCalendar = withDragAndDrop(Calendar);
    const resources = volunteerCategories.filter(
        (c) => props.selectedCategories.indexOf(c.tag) > -1
    );

    return (
        <Container maxWidth="lg">
            {loading ? (
                <Loading />
            ) : (
                <>
                    {error && error.reponse ? error.reponse.data : null}
                    <DnDCalendar
                        localizer={localizer}
                        events={currentList}
                        startAccessor="start_time"
                        endAccessor="end_time"
                        tooltipAccessor={(event: EventCategoryType) =>
                            `${event.title}: ${event.number_of_positions} positions`
                        }
                        style={{ height: 600 }}
                        defaultView="day"
                        defaultDate={props.defaultDate}
                        views={{ day: true, week: UFestWeek }}
                        components={{
                            event: EventCategory,
                            toolbar: (tbarProps: ToolbarProps) => (
                                <CalendarToolbar
                                    {...tbarProps}
                                    openModal={() => setModalOpen(true)}
                                    showCategoryView={true}
                                    switchChange={() =>
                                        props.setCategoryView(
                                            (oldCategoryView) =>
                                                !oldCategoryView
                                        )
                                    }
                                    categoryView={true}
                                    addButton={true}
                                    filter={true}
                                    options={volunteerCategoryTypes}
                                    selectedOptions={props.selectedCategories}
                                    handleChange={props.setSelectedCategories}
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
                        resources={resources}
                        resourceIdAccessor="id"
                        resourceTitleAccessor="tag"
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
        </Container>
    );
};

export default EventsCategoryView;
