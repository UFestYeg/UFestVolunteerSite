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
} from "@mui/material";
// tslint:disable-next-line: no-submodule-imports
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
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
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
// tslint:disable-next-line: no-submodule-imports
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
// tslint:disable-next-line: no-submodule-imports
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useCookies } from "react-cookie";
import { StateHooks } from "../../store/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { VolunteerUrls } from "../../constants";
import { volunteer as volunteerActions } from "../../store/actions";
import { notifyApiError, setAuthHeaders } from "../../store/actions/apiUtils";
import { CustomForm } from "../Form";
import { Loading } from "../Loading";
import CalendarToolbar from "./CalendarToolbar";
import EventDetail from "./EventDetail";
import { hoverExpandStyle } from "./eventHover";
import UFestDay from "./UFestDay";
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
    allDay?: boolean;
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
        myEvent: {
            "& .rbc-event-label": {
                whiteSpace: "normal",
                paddingRight: theme.spacing(2.5),
            },
            ...hoverExpandStyle,
        },
    })
);

interface IEventsDetailView {
    setCategoryView: React.Dispatch<React.SetStateAction<boolean>>;
    selectedCategories: string[];
    setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
    defaultDate: Date | null;
    setDefaultDate: React.Dispatch<React.SetStateAction<Date | null>>;
    selectAll: boolean;
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
}

const EventDetailView: React.FC<IEventsDetailView> = (props) => {
    const theme = useTheme();
    const { classes } = useStyles();
    const dispatch = StateHooks.useAppDispatch();
    const navigate = useNavigate();
    const { pathname: url } = useLocation();
    const [currentList, setList] = useState<VolunteerCategoryType[]>([]);
    const [originalList, setOriginalList] = useState<VolunteerCategoryType[]>(
        []
    );
    const [cookies, _setCookie] = useCookies(["csrftoken"]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const token = StateHooks.useToken();
    const [volunteerCategories, loading, error] = StateHooks.useVolunteerInfo();
    const eventDatesLoading = StateHooks.useEventDatesLoading();
    const volunteerCategoryTypes = StateHooks.useVolunteerCategoryTypes();
    const volunteerCategoryTypeTags = volunteerCategoryTypes.map(
        (categoryType) => {
            return categoryType.tag;
        }
    );

    const browserState = {
        oldCategoryView: false,
        oldDefaultDate: props.defaultDate,
        oldSelectedCategories: props.selectedCategories,
    };

    const colours = chroma
        .scale(["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93"])
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
        setAuthHeaders(token, cookies.csrftoken);
        if (token && import.meta.env.VITE_API_URI !== undefined) {
            axios
                .put(VolunteerUrls.CATEGORY_DETAILS(event.id), {
                    ...event,
                    end_time: end,
                    start_time: start,
                })
                .then(() => {
                    navigate(url, { state: browserState, replace: true });
                    navigate(0);
                })
                .catch((err) => {
                    notifyApiError(err, "Could not update the event.");
                });
        }
    };

    const onEventResize = (data: DragAndDropData) => {
        const { start, end, event } = data;
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
    const DnDCalendar = withDragAndDrop<VolunteerCategoryType, object>(Calendar);
    return (
        <>
            {loading || eventDatesLoading ? (
                <Loading />
            ) : (
                <>
                    <Typography color="error">
                        {typeof error === "string" ? error : null}
                    </Typography>
                    <DnDCalendar
                        className={classes.calendarWrapper}
                        localizer={localizer}
                        events={currentList}
                        startAccessor="start_time"
                        endAccessor="end_time"
                        style={{ height: "calc(100vh - 200px)", minHeight: 600 }}
                        defaultView="day"
                        defaultDate={props.defaultDate ?? new Date()}
                        views={{ day: UFestDay, week: UFestWeek }}
                        components={{
                            event: WrappedEventDetail,
                            toolbar: (
                                tbarProps: ToolbarProps<
                                    VolunteerCategoryType,
                                    object
                                >
                            ) => (
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
