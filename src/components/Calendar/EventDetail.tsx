import { Container } from "@mui/material";
// tslint:disable-next-line: no-submodule-imports
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import React from "react";
import { VolunteerCategoryType } from "./EventsCalendar";
import { useHoverShiftLeft } from "./eventHover";

interface IEventDetails {
    event: VolunteerCategoryType;
    setCategoryView: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
    setDefaultDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

const useStyles = makeStyles()((theme) =>
    ({
        eventRoot: {
            // Fill the full react-big-calendar event box. RBC's
            // `.rbc-event-content` stretches to the event's height, but the
            // Container only takes its intrinsic (text) height by default, so
            // clicks below the text landed on the event box but outside this
            // onClick handler and were ignored. `height: 100%` makes the whole
            // visible card clickable (and still fills the expanded card on
            // hover).
            height: "100%",
            // MUI Container ships 24px side gutters by default. In a narrow
            // event tile that left only ~80px for text, so words wrapped
            // mid-word and spilled out of the block. Drop the gutters (see the
            // `disableGutters`/`maxWidth={false}` props below) and use a small,
            // even padding instead so the text uses the tile's full width and
            // stays inside the block. `overflowWrap` keeps long single words
            // (e.g. "COMMITTEE") from escaping the right edge.
            padding: theme.spacing(0.25, 0.75),
            overflowWrap: "break-word",
        },
    })
);

const EventDetail = ({
    event,
    setCategoryView,
    setSelectedCategories,
    setDefaultDate,
}: IEventDetails) => {
    const theme = useTheme();
    const { classes } = useStyles();
    const containerRef = useHoverShiftLeft<HTMLDivElement>();
    const handleClick = (_event: React.MouseEvent<HTMLDivElement>) => {
        setCategoryView(true);
        setSelectedCategories([event.category]);
        setDefaultDate(new Date(event.start_time));
    };
    return (
        <Container
            onClick={handleClick}
            className={classes.eventRoot}
            ref={containerRef}
            disableGutters
            maxWidth={false}
        >
            <strong>{event.title}</strong>
            <br />
            Available Positions:{" "}
            {event.number_of_positions !== null &&
            event.number_of_open_positions !== null
                ? `${event.number_of_open_positions}/${event.number_of_positions}`
                : "N/A"}
        </Container>
    );
};

export default EventDetail;
