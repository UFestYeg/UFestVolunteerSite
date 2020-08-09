import React from "react";
import {
    ToolbarProps,
    NavigateAction,
    View,
    Messages,
} from "react-big-calendar";
import {
    ButtonGroup,
    Button,
    Grid,
    Typography,
    IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddCircleIcon from "@material-ui/icons/AddCircle";

const useStyles = makeStyles((theme) => ({
    grid: {
        margin: theme.spacing(2),
    },
    active: {
        backgroundColor: theme.palette.primary.dark,
    },
}));

type AddPositionProps = {
    openModal: () => void;
};

const CustomToolbar: React.FC<ToolbarProps & AddPositionProps> = (props) => {
    const classes = useStyles();

    function navigate(action: NavigateAction) {
        props.onNavigate(action);
    }

    function viewItem(view: View) {
        props.onView(view);
    }

    function viewNamesGroup(messages: Messages) {
        const viewNames: View[] = ["week", "day"];
        const view = props.view;

        if (viewNames.length > 1) {
            return viewNames.map((name: View) => (
                <Button
                    key={name}
                    className={view === name ? classes.active : ""}
                    onClick={viewItem.bind(null, name)}
                >
                    {messages[name]}
                </Button>
            ));
        }
    }

    return (
        <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            className={classes.grid}
        >
            <ButtonGroup
                variant="contained"
                color="primary"
                aria-label="contained primary button group"
                size="small"
            >
                <Button onClick={navigate.bind(null, "PREV")}>Previous</Button>
                <Button onClick={navigate.bind(null, "NEXT")}>Next</Button>
            </ButtonGroup>

            <Typography variant="subtitle1">{props.label}</Typography>
            <Grid item direction="row" justify="flex-end" alignItems="center">
                <ButtonGroup
                    variant="contained"
                    color="primary"
                    aria-label="contained primary button group"
                    size="small"
                >
                    {viewNamesGroup(props.localizer.messages)}
                </ButtonGroup>
                <IconButton
                    aria-label="add-event"
                    color="primary"
                    onClick={props.openModal}
                >
                    <AddCircleIcon fontSize="large" />
                </IconButton>
            </Grid>
        </Grid>
    );
};

export default CustomToolbar;
