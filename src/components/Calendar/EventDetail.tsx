import { Container } from "@mui/material";
// tslint:disable-next-line: no-submodule-imports
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import React from "react";
import { VolunteerCategoryType } from "./EventsCalendar";

interface IEventDetails {
    event: VolunteerCategoryType;
    setCategoryView: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
    setDefaultDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

const useStyles = makeStyles()((theme) =>
    ({
        eventRoot: {
            height: "inherit",
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
    const handleClick = (_event: React.MouseEvent<HTMLDivElement>) => {
        setCategoryView(true);
        setSelectedCategories([event.category]);
        setDefaultDate(new Date(event.start_time));
    };
    return (
        <Container onClick={handleClick} className={classes.eventRoot}>
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
