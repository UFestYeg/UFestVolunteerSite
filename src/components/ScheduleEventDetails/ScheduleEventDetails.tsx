import {
    Button,
    List,
    ListItem,
    ListItemProps,
    ListItemText,
    Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { StateHooks } from "../../store/hooks";
import { CustomForm } from "../Form";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            maxWidth: 360,
            backgroundColor: theme.palette.background.paper,
        },
    })
);

function ListItemLink(props: ListItemProps<"a", { button?: true }>) {
    return <ListItem button component="a" {...props} />;
}

type SimpleListType = {
    events: ScheduleEventType[];
};

type ScheduleEventType = {
    id: number;
    title: string;
    start_time: Date;
    end_time: Date;
    number_of_slots: number;
};

const ScheduleEventDetails: React.FC<any> = () => {
    const classes = useStyles();
    const { eventID } = useParams();
    const [currentEvent, setEvent] = useState<ScheduleEventType>();
    const token = StateHooks.useToken();
    const history = useHistory();

    useEffect(() => {
        if (token && process.env["REACT_APP_API_URI"] !== undefined) {
            axios.defaults.headers = {
                Authorization: token,
                "Content-Type": "application/json",
            };
            axios
                .get(`${process.env["REACT_APP_API_URI"]}api/${eventID}/`)
                .then((res) => {
                    setEvent(res.data);
                    console.log(res.data);
                });
        }
    }, [eventID, token]);

    const handleDelete = () => {
        if (token) {
            axios.delete(`${process.env["REACT_APP_API_URI"]}api/${eventID}/`);
            history.push("/events");
        }
    };

    return (
        <div className={classes.root}>
            <Typography variant="h1">Detail Page</Typography>
            <List component="nav" aria-label="schedule event list">
                {currentEvent !== undefined ? (
                    <ListItem button key={`list-${currentEvent.id}`}>
                        <ListItemText primary={currentEvent.title} />
                    </ListItem>
                ) : null}
            </List>
            <CustomForm
                requestTypeProp="PUT"
                eventIdProp={eventID}
                buttonText="Update"
            />
            <form onSubmit={handleDelete}>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                >
                    Delete
                </Button>
            </form>
        </div>
    );
};

export default ScheduleEventDetails;
