// tslint:disable: jsx-no-lambda
// tslint:disable: react-this-binding-issue
// tslint:disable: use-simple-attributes
import {
    Checkbox,
    FormControl,
    InputBase,
    ListItemText,
    MenuItem,
    Select,
    Typography,
} from "@material-ui/core";
// tslint:disable-next-line: no-submodule-imports
import { makeStyles, withStyles } from "@material-ui/core/styles";
import React from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const CustomInput = withStyles((theme) => ({
    root: {
        "label + &": {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: 4,
        margin: theme.spacing(1),
        paddingBottom: 0,
        paddingLeft: theme.spacing(1),
        paddingTop: 0,
        position: "relative",
        transition: theme.transitions.create(["border-color", "box-shadow"]),
        "&:focus": {
            borderColor: theme.palette.primary.main,
            borderRadius: 4,
            boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
        },
    },
}))(InputBase);

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

type FilterProps = {
    selectedOptions: string[];
    handleChange: (
        event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>,
        child?: React.ReactNode
    ) => void;
    options: string[];
};

const CategoryFilter: React.FC<FilterProps> = ({
    selectedOptions,
    handleChange,
    options,
}: FilterProps) => {
    const classes = useStyles();
    return (
        <FormControl
            variant="outlined"
            color="primary"
            className={classes.formControl}
        >
            <Select
                labelId="demo-mutiple-checkbox-label"
                id="demo-mutiple-checkbox"
                className={classes.noPadding}
                multiple
                displayEmpty
                value={selectedOptions}
                onChange={handleChange}
                input={<CustomInput />}
                renderValue={(selected: any) => (
                    <Typography variant="caption">
                        {selected.join(", ")}
                    </Typography>
                )}
                MenuProps={MenuProps}
            >
                <MenuItem disabled value="">
                    <em>Categories</em>
                </MenuItem>
                {options.map((option) => (
                    <MenuItem key={option} value={option}>
                        <Checkbox
                            checked={selectedOptions.indexOf(option) > -1}
                        />
                        <ListItemText primary={option} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default CategoryFilter;
