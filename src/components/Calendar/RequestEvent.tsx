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
// tslint:disable-next-line: no-submodule-imports
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import { Cancel } from "@material-ui/icons";
import axios from "axios";
import moment from "moment";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { VolunteerUrls } from "../../constants";
import { Notification } from "react-notification-system";
import { error, success } from "react-notification-system-redux";
import { useDispatch } from "react-redux";

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

const useStyles = makeStyles((theme) =>
    createStyles({
        card: {
            alignItems: "center",
            boxShadow: "0px 14px 80px rgba(34, 35, 58, 0.2)",
            color: theme.palette.primary.dark,
            display: "flex",
            flexDirection: "row",
            margin: 8,
            justifyContent: "center",
            transition: "0.3s",
            textAlign: "center",
        },
        cardContent: {
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
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

const RequestEvent = ({ event }: { event: any }) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const [requestError, setRequestError] = useState<any>();
    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    );
    const dispatch = useDispatch();
    const handleClick = (
        clickEvent: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        setAnchorEl(clickEvent.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleDelete = (role: any) => {
        axios
            .delete(VolunteerUrls.REQUESTS_DETAILS(role.id))
            .then((res) => {
                console.log(res);
                const notificationOpts: Notification = {
                    title: "Succcess!",
                    message: `Request for ${role.title} has been deleted.`,
                    position: "tr",
                    autoDismiss: 5,
                };
                dispatch(success(notificationOpts));
                history.go(0);
            })
            .catch((err) => {
                setRequestError(err);
                const notificationOpts: Notification = {
                    title: "Oops, something went wrong!",
                    message: "Could not delete request, please try again.",
                    position: "tr",
                    autoDismiss: 5,
                };
                dispatch(error(notificationOpts));
                if (err.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(err.response.data);
                    console.log(err.response.status);
                    console.log(err.response.headers);
                } else if (err.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(err.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log("Error", err.message);
                }
                console.log(err.config);
                console.error(err);
            });
    };

    const handleDeleteClick = () => handleDelete(event);

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const tooLateToDelete = () => {
        const weekBeforeStart = moment(event.start_time).subtract(1, "w");

        return moment(new Date()).isAfter(weekBeforeStart);
    };
    return (
        <>
            <Grid
                container
                direction="row-reverse"
                alignItems="flex-start"
                justify="space-between"
            >
                <Grid item>
                    <IconButton
                        aria-label="open delete popover"
                        onClick={handleClick}
                    >
                        <Cancel />
                    </IconButton>
                </Grid>
                <Grid item>
                    <Typography variant="subtitle2">{event.title}</Typography>
                    <p>Request Status: {event.status}</p>
                </Grid>
            </Grid>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    horizontal: "right",
                    vertical: "top",
                }}
                transformOrigin={{
                    horizontal: "center",
                    vertical: "bottom",
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
                            title="Delete Request"
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
                                onClick={handleDeleteClick}
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

export { RequestEvent };
