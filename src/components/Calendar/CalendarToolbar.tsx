import React from "react";
import {
    ToolbarProps,
    NavigateAction,
    View,
    Messages,
} from "react-big-calendar";
import { ButtonGroup, Button, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    grid: {
        margin: theme.spacing(2),
    },
}));

const CustomToolbar: React.FC<ToolbarProps> = (props) => {
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
                    className={view === name ? "rbc-active" : ""}
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
            {props.view === "day" ? (
                <ButtonGroup
                    variant="contained"
                    color="primary"
                    aria-label="contained primary button group"
                    size="small"
                >
                    <Button onClick={navigate.bind(null, "PREV")}>
                        Previous
                    </Button>
                    <Button onClick={navigate.bind(null, "NEXT")}>Next</Button>
                </ButtonGroup>
            ) : (
                ""
            )}
            <Typography variant="h6">{props.label}</Typography>
            <ButtonGroup
                variant="contained"
                color="primary"
                aria-label="contained primary button group"
                size="small"
            >
                {viewNamesGroup(props.localizer.messages)}
            </ButtonGroup>
        </Grid>
    );
};

export default CustomToolbar;
