import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Container,
    IconButton,
    List,
    ListItem,
    Popover,
    Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import { Cancel } from "@material-ui/icons";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, ToolbarProps } from "react-big-calendar";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { VolunteerUrls } from "../../constants";
import { volunteer as volunteerActions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import { CalendarToolbar, UFestWeek } from "../Calendar";

type ScheduleEventType = {
    id: number;
    title: string;
    start_time: string | Date;
    end_time: string | Date;
    allDay?: boolean;
    resource?: any;
    category_type: any;
    description?: string;
};

type DragAndDropData = {
    event: ScheduleEventType;
    start: string | Date;
    end: string | Date;
    allDay: boolean;
};

type DragStartArgs = {
    event: ScheduleEventType;
    action: "resize" | "move";
    direction: "UP" | "DOWN" | "LEFT" | "RIGHT";
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

const PositionRequestPage: React.FC = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();
    const history = useHistory();
    const { categoryTypeID, roleID } = useParams();
    const userProfile = StateHooks.useUserProfile();
    const [currentList, setList] = useState<ScheduleEventType[]>([]);
    const [currentCategory, setCategory] = useState<string>("");

    const token = StateHooks.useToken();

    useEffect(() => {
        if (token) {
            dispatch(volunteerActions.getVolunteerCategoryTypes());
            axios.defaults.headers = {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            };

            axios
                .get(
                    VolunteerUrls.CATEGORIES_WITH_ROLE_LIST(
                        categoryTypeID,
                        roleID
                    )
                )
                .then((res) => {
                    const data = res.data;
                    const category = data.pop();
                    setCategory(category.role_title);

                    const mappedData = data.map((d: any) => {
                        d.start_time = new Date(d.start_time);
                        d.end_time = new Date(d.end_time);
                        return d;
                    });
                    setList(mappedData);
                })
                .catch((err) => console.error(err));
        }
    }, [categoryTypeID, dispatch, roleID, token]);

    const Event = ({ event }: { event: any }) => {
        const [requestError, setRequestError] = useState<any>();
        const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(
            null
        );

        const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
            setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
            setAnchorEl(null);
        };

        const handleSubmit = (role: any) => {
            axios
                .post(VolunteerUrls.REQUESTS, {
                    status: "PENDING",
                    user: userProfile.pk,
                    role,
                })
                .then((res) => {
                    console.log(res);
                    history.push("/volunteer/profile/edit");
                })
                .catch((err) => {
                    setRequestError(err);
                    console.log(err.response);
                    console.error(err);
                });
        };

        const handleSubmitClick = () => handleSubmit(selectedRole);

        const errorMessage =
            requestError &&
            requestError.response.data &&
            requestError.response.data.detail ? (
                <Typography variant="body1" color="error">
                    {requestError.response.data.detail}
                </Typography>
            ) : null;

        const open = Boolean(anchorEl);
        const id = open ? "simple-popover" : undefined;
        const selectedRole = event.roles.find(
            (r: any) => r.title === currentCategory
        );
        return (
            <>
                <Container onClick={handleClick} className={classes.eventRoot}>
                    <strong>{event.title}</strong> : {currentCategory}
                    <br />
                    Available Positions:{" "}
                    {selectedRole.number_of_positions !== null &&
                    selectedRole.number_of_open_positions !== null
                        ? `${selectedRole.number_of_open_positions}/${selectedRole.number_of_positions}`
                        : "N/A"}
                </Container>
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
                                title="Submit Request"
                            />
                            {errorMessage}
                            <List dense>
                                <ListItem>
                                    category:{" "}
                                    {event.category_type
                                        ? event.category_type.tag
                                        : ""}
                                </ListItem>
                                <ListItem>
                                    position: {selectedRole.title}
                                </ListItem>
                                <ListItem>
                                    start date:{" "}
                                    {moment(event.start_time.getTime()).format(
                                        "YYYY-MM-DD hh:mm a"
                                    )}
                                </ListItem>
                                <ListItem>
                                    end date:{" "}
                                    {moment(event.end_time.getTime()).format(
                                        "YYYY-MM-DD hh:mm a"
                                    )}
                                </ListItem>
                            </List>
                            <CardActions disableSpacing>
                                <Button
                                    aria-label="add to favorites"
                                    onClick={handleSubmitClick}
                                >
                                    Submit
                                </Button>
                                <Button
                                    aria-label="share"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </Button>
                            </CardActions>
                        </CardContent>
                    </Card>
                </Popover>
            </>
        );
    };

    const localizer = momentLocalizer(moment);

    return (
        <Container maxWidth="lg">
            <Calendar
                localizer={localizer}
                events={currentList}
                startAccessor="start_time"
                endAccessor="end_time"
                style={{ height: 600 }}
                defaultView="week"
                defaultDate={new Date(2021, 4, 21)}
                views={{ day: true, week: UFestWeek }}
                components={{
                    event: Event,
                    toolbar: (props: ToolbarProps) => (
                        <CalendarToolbar
                            {...props}
                            addButton={false}
                            categoryView={false}
                            filter={false}
                        />
                    ),
                }}
                selectable
                popup={true}
                scrollToTime={moment("08:00:00 am", "hh:mm:ss a").toDate()}
            />
        </Container>
    );
};

export default PositionRequestPage;
