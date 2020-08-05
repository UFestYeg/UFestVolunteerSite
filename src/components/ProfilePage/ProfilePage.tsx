import {
    Avatar,
    Button,
    Grid,
    Typography,
    List,
    ListItem,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { user as userActions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import { userAvatarString } from "../../store/utils";

const useStyles = makeStyles((theme) => ({
    large: {
        width: theme.spacing(8),
        height: theme.spacing(8),
        margin: theme.spacing(2),
    },
    grid: {
        // border: "1px solid black",
        marginTop: theme.spacing(2),
    },
    button: {
        background: theme.palette.primary.main,
        border: 0,
        borderRadius: theme.spacing(2),
        // color: "white",
        paddingBlock: theme.spacing(3),
        margin: theme.spacing(3),
    },
    change: {
        background: theme.palette.secondary.main,
        "&:hover": {
            background: theme.palette.secondary.dark,
        },
    },
}));

const ProfilePage: React.FC = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();
    const { url } = useRouteMatch();

    useEffect(() => {
        dispatch(userActions.getUserProfile());
    }, [dispatch]);

    const userProfile = StateHooks.useUserProfile();
    console.log(userProfile);
    return (
        <Grid
            className={classes.grid}
            container
            spacing={2}
            direction="column"
            justify="center"
            alignItems="flex-start"
        >
            <Grid
                className={classes.grid}
                item
                container
                direction="row"
                alignItems="flex-start"
                justify="flex-start"
            >
                <Avatar className={classes.large}>
                    {userAvatarString(userProfile)}
                </Avatar>

                <Typography variant="h3">
                    {userProfile.first_name
                        ? `${userProfile.first_name} ${userProfile.last_name}`
                        : "Firstname Lastname"}
                </Typography>
            </Grid>
            <Grid
                className={classes.grid}
                item
                container
                direction="column"
                alignItems="flex-start"
                justify="flex-start"
                xs={12}
            >
                <Typography variant="h5">Other Info</Typography>
                <List dense>
                    <ListItem>email</ListItem>
                    <ListItem>username</ListItem>
                    <ListItem>over_eighteen</ListItem>
                    <ListItem>age</ListItem>
                    <ListItem>dietary_restrictions</ListItem>
                    <ListItem>emergency_contact</ListItem>
                    <ListItem>previous_volunteer</ListItem>
                    <ListItem>special_interests</ListItem>
                    <ListItem>student_volunteer_hours</ListItem>
                    <ListItem>medical_restrictions</ListItem>
                    <ListItem>t_shirt_size</ListItem>
                    <ListItem>comments</ListItem>
                </List>
            </Grid>
            <Grid className={classes.grid} item>
                <Button
                    size="large"
                    className={clsx(classes.change, classes.button)}
                    component={Link}
                    to={`${url}/change_password`}
                    color="secondary"
                    variant="contained"
                    disableElevation
                >
                    Change Password
                </Button>
            </Grid>
            <Grid className={classes.grid} item>
                <Button
                    size="large"
                    className={clsx(classes.change, classes.button)}
                    component={Link}
                    to={`${url}/edit`}
                    color="secondary"
                    variant="contained"
                    disableElevation
                >
                    Edit Profile
                </Button>
            </Grid>
        </Grid>
    );
};

export default ProfilePage;
