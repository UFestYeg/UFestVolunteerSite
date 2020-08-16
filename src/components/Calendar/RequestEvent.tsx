import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Grid,
    IconButton,
    Popover,
    Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import { Cancel } from "@material-ui/icons";
import axios from "axios";
import moment from "moment";
import React, { useState } from "react";
import { EventPropGetter } from "react-big-calendar";
import { useHistory } from "react-router-dom";
import { VolunteerUrls } from "../../constants";

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

const useStyles = makeStyles((theme) =>
    createStyles({
        card: {
            transition: "0.3s",
            boxShadow: "0px 14px 80px rgba(34, 35, 58, 0.2)",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            textAlign: "center",
            margin: 8,
            color: theme.palette.primary.dark,
            justifyContent: "center",
        },
        cardContent: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
        },
        cardHeader: {
            width: "inherit",
        },
        eventRoot: {
            height: "inherit",
        },
        typography: {
            padding: theme.spacing(2),
        },
    })
);

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
    const theme = useTheme();
    const classes = useStyles(theme);
    const [requestError, setRequestError] = useState<any>();
    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleDelete = (role: any) => {
        console.log(role);
        console.log("role");
        axios
            .delete(VolunteerUrls.REQUESTS_DETAILS(role.id))
            .then((res) => {
                console.log(res);
                // history.push("/volunteer/profile");
                history.go(0);
            })
            .catch((err) => {
                setRequestError(err);
                console.log(err.response);
                console.error(err);
            });
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const tooLateToDelete = () => {
        const weekBeforeStart = moment(event.start_time).subtract(1, "w");

        return moment(new Date()).isAfter(weekBeforeStart);
    };
    return (
        <>
            <Grid
                direction="column"
                alignItems="center"
                justify="space-between"
                onClick={handleClick}
            >
                <Typography variant="subtitle2">{event.title}</Typography>
                <p>Request Status: {event.status}</p>
            </Grid>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                <Card className={classes.card}>
                    <CardContent className={classes.cardContent}>
                        <CardHeader
                            className={classes.cardHeader}
                            action={
                                <IconButton
                                    aria-label="settings"
                                    onClick={handleClose}
                                >
                                    <Cancel />
                                </IconButton>
                            }
                            title="Submit Request"
                        />
                        {requestError &&
                        requestError.response &&
                        requestError.response.data ? (
                            <Typography color="error">
                                {requestError.response.data}
                            </Typography>
                        ) : (
                            ""
                        )}
                        <Typography>
                            You are only able to delete requests through the
                            site up until a week before the event. After this
                            you must phone the volunteer coordinator directly.{" "}
                            {tooLateToDelete()
                                ? "Please phone the coordinator"
                                : "Are you sure you want to delete your request?"}
                        </Typography>
                        <CardActions disableSpacing>
                            <Button
                                aria-label="delete request"
                                onClick={() => handleDelete(event)}
                                disabled={tooLateToDelete()}
                            >
                                Delete
                            </Button>
                            <Button aria-label="cancel" onClick={handleClose}>
                                Cancel
                            </Button>
                        </CardActions>
                    </CardContent>
                </Card>
            </Popover>
        </>
    );
};

export { customRequestStyle, RequestEvent };
