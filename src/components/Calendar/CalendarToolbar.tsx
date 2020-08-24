// tslint:disable: jsx-no-lambda
// tslint:disable: react-this-binding-issue
// tslint:disable: use-simple-attributes

import {
    Button,
    ButtonGroup,
    FormControlLabel,
    Grid,
    IconButton,
    Switch,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AddCircle as AddCircleIcon } from "@material-ui/icons";
import React from "react";
import {
    Messages,
    NavigateAction,
    ToolbarProps,
    View,
} from "react-big-calendar";
import CategoryFilter from "./CategoryFilter";

const useStyles = makeStyles((theme) => ({
    active: {
        backgroundColor: theme.palette.primary.dark,
    },
    formControl: {
        margin: theme.spacing(1),
        maxWidth: 200,
        minWidth: 100,
    },
    grid: {
        margin: theme.spacing(2),
    },
    noPadding: {
        paddingBottom: 0,
        paddingTop: 0,
    },
}));

type AddPositionProps = {
    openModal?: () => void;
};

type CategoryViewProps = {
    showCategoryView?: boolean;
    switchChange?: () => void;
};

type FilterProps = {
    selectedOptions?: string[];
    handleChange?: (value: string[]) => void;
    options?: string[];
};

type ConfigProps = {
    addButton: boolean;
    filter: boolean;
    categoryView: boolean;
};

const CustomToolbar: React.FC<
    ToolbarProps &
        AddPositionProps &
        CategoryViewProps &
        FilterProps &
        ConfigProps
> = (props) => {
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

    const handleChange = (event: any) => {
        if (props.handleChange !== undefined) {
            props.handleChange(event.target.value);
        }
    };

    const handleResetFilter = () => {
        if (props.handleChange !== undefined) {
            const resetList = props.options !== undefined ? props.options : [];
            props.handleChange(resetList);
        }
    };
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
                {props.filter ? (
                    <>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleResetFilter}
                        >
                            Reset Filter
                        </Button>
                        <CategoryFilter
                            options={
                                props.options !== undefined ? props.options : []
                            }
                            selectedOptions={
                                props.selectedOptions !== undefined
                                    ? props.selectedOptions
                                    : []
                            }
                            handleChange={handleChange}
                        />
                    </>
                ) : null}
                {props.categoryView ? (
                    <FormControlLabel
                        control={
                            <Switch
                                size="small"
                                color="primary"
                                checked={props.showCategoryView}
                                onChange={props.switchChange}
                            />
                        }
                        label={
                            <Typography variant="overline">
                                Category View
                            </Typography>
                        }
                    />
                ) : null}
                <ButtonGroup
                    variant="contained"
                    color="primary"
                    aria-label="contained primary button group"
                    size="small"
                >
                    {viewNamesGroup(props.localizer.messages)}
                </ButtonGroup>
                {props.addButton ? (
                    <IconButton
                        aria-label="add-event"
                        color="primary"
                        onClick={props.openModal}
                    >
                        <AddCircleIcon fontSize="large" />
                    </IconButton>
                ) : null}
            </Grid>
        </Grid>
    );
};

export default CustomToolbar;
