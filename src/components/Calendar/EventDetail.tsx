import { Container } from "@material-ui/core";
// tslint:disable-next-line: no-submodule-imports
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import React from "react";
import { VolunteerCategoryType } from "./EventsCalendar";

interface IEventDetails {
    event: VolunteerCategoryType;
    setCategoryView: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
    setDefaultDate: React.Dispatch<React.SetStateAction<Date>>;
}

const useStyles = makeStyles((theme) =>
    createStyles({
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
    const classes = useStyles(theme);
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
