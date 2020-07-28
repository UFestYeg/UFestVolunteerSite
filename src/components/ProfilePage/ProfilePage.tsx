import {
    Avatar,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    List,
    ListItem,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import VolunteerRequestCard from "./VolunteerRequestCard";

const useStyles = makeStyles((theme) => ({
    large: {
        width: theme.spacing(10),
        height: theme.spacing(10),
    },
    grid: {
        margin: theme.spacing(2),
    },
    avatar: {
        padding: theme.spacing(2),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    label: {
        color: "grey",
    },
    card: {
        width: "100%",
    },
}));

const ProfilePage: React.FC = () => {
    const classes = useStyles();
    return (
        <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="flex-start"
            className={classes.grid}
        >
            <Grid
                item
                container
                direction="row"
                justify="center"
                alignItems="center"
            >
                <Grid
                    className={classes.avatar}
                    item
                    container
                    direction="column"
                    xs={3}
                    justify="center"
                    alignItems="flex-end"
                >
                    <Avatar className={classes.large}>
                        <Typography variant="h6">GP</Typography>
                    </Avatar>
                </Grid>
                <Grid item xs={7} alignItems="flex-end">
                    <Typography align="left" variant="h4">
                        User Name
                    </Typography>
                    <Typography align="left" variant="body1">
                        description of the event
                    </Typography>
                </Grid>
            </Grid>
            <Grid
                container
                item
                xs={12}
                justify="space-between"
                alignItems="flex-start"
                direction="row"
            >
                <Typography variant="h3" align="left">
                    Volunteer Requests
                </Typography>
                <Grid item xs={5}>
                    <FormControl className={classes.formControl}>
                        <InputLabel
                            id="demo-simple-select-label"
                            color="primary"
                            className={classes.label}
                        >
                            Status
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                        >
                            <MenuItem value={10}>Pending</MenuItem>
                            <MenuItem value={20}>Accepted</MenuItem>
                            <MenuItem value={30}>Denied</MenuItem>
                            <MenuItem value={40}>Unavailable</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container item xs={10} justify="center">
                <List className={classes.card}>
                    <ListItem component={VolunteerRequestCard} />
                    <ListItem component={VolunteerRequestCard} />
                    <ListItem component={VolunteerRequestCard} />
                    <ListItem component={VolunteerRequestCard} />
                    <ListItem component={VolunteerRequestCard} />
                    <ListItem component={VolunteerRequestCard} />
                    <ListItem component={VolunteerRequestCard} />
                    <ListItem component={VolunteerRequestCard} />
                    <ListItem component={VolunteerRequestCard} />
                </List>
            </Grid>
        </Grid>
    );
};

export default ProfilePage;
