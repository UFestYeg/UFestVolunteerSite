import {
    Button,
    List,
    ListItem,
    ListItemProps,
    ListItemText,
    Typography,
    Grid,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
    Theme,
    useTheme,
} from "@material-ui/core/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { StateHooks } from "../../store/hooks";
import { CustomForm } from "../Form";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            // maxWidth: 360,
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
    const theme = useTheme();
    const classes = useStyles(theme);
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
                .get(
                    `${process.env["REACT_APP_API_URI"]}api/events/${eventID}/`
                )
                .then((res) => {
                    setEvent(res.data);
                    console.log(res.data);
                });
        }
    }, [eventID, token]);

    const handleDelete = () => {
        if (token) {
            axios.delete(
                `${process.env["REACT_APP_API_URI"]}api/events/${eventID}/`
            );
            history.push("/events");
        }
    };

    return (
        <div className={classes.root}>
            <Typography variant="h2">Detail Page</Typography>
            {currentEvent !== undefined ? (
                <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="flex-start"
                >
                    <Grid item>
                        <Typography variant="h5">
                            {currentEvent.title}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                    >
                        <Grid
                            item
                            container
                            direction="column"
                            xs={5}
                            justify="flex-start"
                            alignItems="flex-start"
                        >
                            <Typography variant="subtitle1">Start:</Typography>
                            <Typography variant="body1">
                                {currentEvent.start_time}
                            </Typography>
                            <Typography variant="subtitle1">End:</Typography>
                            <Typography variant="body1">
                                {currentEvent.end_time}
                            </Typography>
                        </Grid>
                        <Grid item xs={7}>
                            <Typography variant="subtitle1">
                                Description
                            </Typography>
                            <Typography variant="body1">
                                description of the event
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        justify="flex-start"
                        alignItems="flex-start"
                    >
                        <Typography variant="body1">
                            Number of volunteer slots available:{" "}
                            {currentEvent.number_of_slots}
                        </Typography>
                    </Grid>
                </Grid>
            ) : null}
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
