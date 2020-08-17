import { Container } from "@material-ui/core";
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import React from "react";
import { VolunteerCategoryType } from "./EventsCalendar";

interface IEventDetails {
    event: VolunteerCategoryType;
    setCategoryView: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
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
}: IEventDetails) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const handleClick = (_event: React.MouseEvent<HTMLDivElement>) => {
        setCategoryView(true);
        setSelectedCategories([event.category]);
    };
    return (
        <Container onClick={handleClick} className={classes.eventRoot}>
            <strong>{event.title}</strong> : {event.category}
            <br />
            {event.number_of_positions &&
                "Available Positions:  " + event.number_of_positions}
        </Container>
    );
};

export default EventDetail;
