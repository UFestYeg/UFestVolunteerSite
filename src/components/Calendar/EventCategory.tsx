import {
    Card,
    CardContent,
    CardHeader,
    Container,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    Popover,
    Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import {
    Cancel,
    CancelPresentation,
    CheckBox,
    FiberManualRecord,
} from "@material-ui/icons";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { volunteer as volunteerActions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import { Loading } from "../Loading";

export type EventCategoryType = {
    resourceId: number;
    title: string;
    start_time: string | Date;
    end_time: string | Date;
    allDay?: boolean;
    resource?: any;
    description?: string;
    roles?: any;
    number_of_positions: number | null;
    category: string;
    requests?: any[];
    roleID: number;
    eventID: number;
};

export const defaultEventCategory = {
    resourceId: -1,
    title: "",
    start_time: "",
    end_time: "",
    allDay: false,
    resource: "",
    description: "",
    roles: [],
    number_of_positions: -1,
    category: "",
    requests: [],
    roleID: -1,
    eventID: -1,
};
interface AutosizerProps {
    height: number;
    width: number;
}

const useStyles = makeStyles((theme) =>
    createStyles({
        card: {
            transition: "0.3s",
            boxShadow: "0px 14px 80px rgba(34, 35, 58, 0.2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            margin: 8,
            color: theme.palette.primary.dark,
            justifyContent: "center",
        },
        cardContent: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
        },
        cardHeader: {
            width: "-webkit-fill-available",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.text.secondary,
        },
        eventRoot: {
            height: "inherit",
        },
        accept: {
            color: "green",
        },
        deny: { color: "red" },
        typography: {
            padding: theme.spacing(2),
        },
    })
);

const EventCategory = ({ event }: { event: any }) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();
    const [_categories, loading, error] = StateHooks.useVolunteerInfo();
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
    const { requests } = event;

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAcceptClick = (request: any) => {
        // debugger;
        console.log("event", request);
        dispatch(volunteerActions.acceptRequest(request));
        handleClose();
    };

    const handleDenyClick = (request: any) => {
        console.log("event", request);
        dispatch(volunteerActions.denyRequest(request));
        handleClose();
    };

    const renderRow = (props: ListChildComponentProps) => {
        const { data, index, style } = props;
        const request = data[index];
        const useDivider = index !== data.length - 1;
        console.log("request", request);

        return (
            <>
                {request && request.user_profile ? (
                    <ListItem
                        style={style}
                        key={index}
                        divider={useDivider}
                        button
                    >
                        <ListItemIcon>
                            <FiberManualRecord />
                        </ListItemIcon>
                        <ListItemText
                            primary={`${request.user_profile.first_name} ${request.user_profile.last_name}`}
                            secondary={`Status: ${request.status}`}
                            secondaryTypographyProps={{ color: "textPrimary" }}
                        />
                        <IconButton
                            edge="end"
                            className={classes.accept}
                            aria-label="accept"
                            onMouseDown={() => handleAcceptClick(request)}
                        >
                            <CheckBox />
                        </IconButton>
                        <IconButton
                            edge="end"
                            className={classes.deny}
                            aria-label="deny"
                            onMouseDown={() => handleDenyClick(request)}
                        >
                            <CancelPresentation />
                        </IconButton>
                    </ListItem>
                ) : null}
            </>
        );
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
        <>
            <Container onClick={handleClick} className={classes.eventRoot}>
                <strong>{event.title}</strong>
                <br />
                {event.number_of_positions &&
                    "Available Positions:  " + event.number_of_positions}
            </Container>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                <Card className={classes.card}>
                    {loading ? (
                        <Loading />
                    ) : (
                        <>
                            <CardHeader
                                className={classes.cardHeader}
                                action={
                                    <IconButton
                                        aria-label="close"
                                        onClick={handleClose}
                                    >
                                        <Cancel />
                                    </IconButton>
                                }
                                title="Requests"
                                subheader={`${event.category}: ${event.title}`}
                            />
                            <CardContent className={classes.cardContent}>
                                <Typography color="error">
                                    {error && error.reponse
                                        ? error.reponse.data
                                        : null}
                                </Typography>
                                {requests && requests.length > 0 ? (
                                    <FixedSizeList
                                        itemData={requests}
                                        itemSize={60}
                                        itemCount={requests.length}
                                        height={150}
                                        width={400}
                                    >
                                        {renderRow}
                                    </FixedSizeList>
                                ) : (
                                    <Typography>No Requests</Typography>
                                )}
                            </CardContent>
                        </>
                    )}
                </Card>
            </Popover>
        </>
    );
};

export default EventCategory;
