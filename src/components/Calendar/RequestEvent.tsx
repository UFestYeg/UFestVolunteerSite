import React from "react";
import { EventPropGetter } from "react-big-calendar";
import { Grid, Typography } from "@material-ui/core";

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

const styles = {
    accepted: {
        backgroundColor: "#69bb3c",
        border: "2px solid #33691E",
    },
    pending: {
        backgroundColor: "#ffcc00",
        color: "black",
        border: "2px solid #FBC02D",
    },
    unavailable: {
        backgroundColor: "#BDBDBD",
        color: "black",
        border: "2px solid #616161",
    },
    denied: {
        backgroundColor: "#F44336",
        border: "2px solid #D32F2F",
    },
};

const customRequestStyle: EventPropGetter<UserRequestType> = (
    event: UserRequestType,
    start: string | Date,
    end: string | Date,
    isSelected: boolean
) => {
    switch (event.status) {
        case "PENDING":
            return { style: styles.pending };
        case "ACCEPTED":
            return { style: styles.accepted };
        case "UNAVAILABLE":
            return { style: styles.unavailable };
        case "DENIED":
            return { style: styles.denied };
        default:
            return { className: "rbc-event" };
    }
};

const RequestEvent = ({ event }: { event: any }) => {
    return (
        <Grid direction="column" alignItems="center" justify="space-between">
            <Typography variant="subtitle2">{event.title}</Typography>
            <p>Request Status: {event.status}</p>
        </Grid>
    );
};

export { customRequestStyle, RequestEvent };
