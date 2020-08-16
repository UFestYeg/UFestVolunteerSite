import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Container,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Popover,
    Typography,
    ListItemIcon,
    ListItemSecondaryAction,
    Switch,
} from "@material-ui/core";
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import { Cancel, Check, FiberManualRecord } from "@material-ui/icons";
import axios from "axios";
import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { VolunteerUrls } from "../../constants";
import { volunteer as volunteerActions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";

interface AutosizerProps {
    height: number;
    width: number;
}

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            width: "100%",
            height: 400,
            maxWidth: 300,
            backgroundColor: theme.palette.background.paper,
        },
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

const CategoryEvent = ({ event }: { event: any }) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const history = useHistory();
    const [requestError, setRequestError] = useState<any>();
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
    const { roles } = event;

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const renderRow = (props: ListChildComponentProps) => {
        const { index, style } = props;
        const requests = props.data[props.index];

        return (
            <ListItem button style={style} key={index}>
                <ListItemIcon>
                    <FiberManualRecord />
                </ListItemIcon>
                <ListItemText
                    primary={`${requests.user.first_name} ${requests.user.last_name}`}
                />
                <ListItemSecondaryAction>
                    <IconButton aria-label="accept" onClick={handleClose}>
                        <Check />
                    </IconButton>
                    <IconButton aria-label="deny" onClick={handleClose}>
                        <Cancel />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
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
                                    aria-label="close"
                                    onClick={handleClose}
                                >
                                    <Cancel />
                                </IconButton>
                            }
                            title="Requests"
                        />
                        <AutoSizer>
                            {({ height, width }: AutosizerProps) => (
                                <FixedSizeList
                                    itemData={roles}
                                    itemSize={150}
                                    itemCount={roles.length}
                                    height={height}
                                    width={width}
                                >
                                    {(renderProps: ListChildComponentProps) =>
                                        renderRow(renderProps)
                                    }
                                </FixedSizeList>
                            )}
                        </AutoSizer>
                    </CardContent>
                </Card>
            </Popover>
        </>
    );
};

export default CategoryEvent;
