import {
    Avatar,
    Button,
    Grid,
    Typography,
    Paper,
    Tabs,
    Tab,
    Container,
    Divider,
    Box,
} from "@material-ui/core";
import { TabPanel } from "@material-ui/lab";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { user as userActions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import { userAvatarString } from "../../store/utils";

const useStyles = makeStyles((theme) => ({
    large: {
        width: theme.spacing(10),
        height: theme.spacing(10),
    },
    grid: {
        // border: "1px solid black",
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    container: {
        // border: "1px solid black",
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        width: "99%",
    },
    button: {
        background: theme.palette.primary.main,
        border: 0,
        borderRadius: theme.spacing(2),
        // color: "white",
        paddingBlock: theme.spacing(2),
        margin: theme.spacing(1),
    },
    change: {
        background: theme.palette.secondary.main,
        "&:hover": {
            background: theme.palette.secondary.dark,
        },
        tabs: {
            width: "100vw",
        },
    },
    paper: {
        background: theme.palette.secondary.main,
    },
    hidden: {
        display: "none",
    },
    fullWidth: {
        width: "95%",
        padding: theme.spacing(2),
    },
    tabPanel: {
        margin: theme.spacing(2),
    },
    divider: {
        margin: "2.1%",
    },
    heading: {
        marginLeft: theme.spacing(4),
        width: "95%",
    },
}));

const ProfilePage: React.FC = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();
    const { url } = useRouteMatch();
    const [value, setValue] = useState<number>(0);
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        dispatch(userActions.getUserProfile());
    }, [dispatch]);

    const userProfile = StateHooks.useUserProfile();
    type TabPanelProps = {
        children: React.ReactNode;
        index: number;
        value: number;
    };
    function TabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;

        return (
            <Container
                maxWidth="lg"
                className={value != index ? classes.hidden : classes.tabPanel}
                children={[children]}
            />
        );
    }

    return (
        <Grid
            className={classes.container}
            container
            spacing={2}
            direction="column"
            justify="center"
            alignItems="center"
        >
            <Paper className={classes.paper}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label="My Profile" />
                    <Tab label="My Schedule" />
                </Tabs>
            </Paper>

            <Grid
                className={classes.grid}
                container
                spacing={1}
                justify="center"
                alignItems="flex-start"
                direction="column"
                xs={12}
            >
                <Grid
                    container
                    item
                    direction="row"
                    alignItems="center"
                    justify="flex-start"
                    className={classes.heading}
                >
                    <Grid className={classes.grid} item>
                        <Avatar className={classes.large}>
                            {userAvatarString(userProfile)}
                        </Avatar>
                    </Grid>
                    <Grid className={classes.tabPanel} item>
                        <Typography variant="h2">
                            {userProfile.first_name
                                ? `${userProfile.first_name} ${userProfile.last_name}`
                                : "Firstname Lastname"}
                        </Typography>
                    </Grid>
                </Grid>
                <TabPanel value={value} index={0}>
                    <Paper elevation={3} className={classes.fullWidth}>
                        <Grid
                            className={classes.grid}
                            item
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                        >
                            <Typography variant="h3">Other Info</Typography>
                            <Divider orientation="vertical" flexItem />
                            <Grid
                                item
                                container
                                direction="column"
                                alignItems="stretch"
                                justify="flex-start"
                                xs={3}
                            >
                                <Button
                                    size="small"
                                    className={clsx(
                                        classes.change,
                                        classes.button
                                    )}
                                    component={Link}
                                    to={`${url}/change_password`}
                                    color="secondary"
                                    variant="contained"
                                    disableElevation
                                >
                                    Change Password
                                </Button>

                                <Button
                                    size="small"
                                    className={clsx(
                                        classes.change,
                                        classes.button
                                    )}
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
                        <Grid
                            className={classes.grid}
                            item
                            container
                            direction="row"
                            justify="space-between"
                            // xs={10}
                        >
                            <Typography variant="subtitle2">Email</Typography>
                            <Box
                                flexGrow={1}
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Divider className={classes.divider} />
                            </Box>
                            <Typography variant="body1">
                                {userProfile.email}
                            </Typography>
                        </Grid>
                        <Grid
                            className={classes.grid}
                            item
                            container
                            direction="row"
                            justify="space-between"
                            // xs={10}
                        >
                            <Typography variant="subtitle2">
                                Username
                            </Typography>
                            <Box
                                flexGrow={1}
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Divider className={classes.divider} />
                            </Box>
                            <Typography variant="body1">
                                {userProfile.username}
                            </Typography>
                        </Grid>
                        {!userProfile.over_eighteen ? (
                            <Grid
                                className={classes.grid}
                                item
                                container
                                direction="row"
                                justify="space-between"
                                // xs={10}
                            >
                                <Typography variant="subtitle2">
                                    Over 110?
                                </Typography>
                                <Box
                                    flexGrow={1}
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Divider className={classes.divider} />
                                </Box>
                                <Typography variant="body1">No</Typography>
                                <Typography variant="subtitle2">Age</Typography>
                                <Box
                                    flexGrow={1}
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Divider className={classes.divider} />
                                </Box>
                                <Typography variant="body1">
                                    {userProfile.age}
                                </Typography>
                            </Grid>
                        ) : null}
                        <Grid
                            className={classes.grid}
                            item
                            container
                            direction="row"
                            justify="space-between"
                            // xs={10}
                        >
                            <Typography variant="subtitle2">
                                Medical Resitrictions
                            </Typography>
                            <Box
                                flexGrow={1}
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Divider className={classes.divider} />
                            </Box>
                            <Typography variant="body1">
                                {userProfile.medical_restrictions}
                            </Typography>
                        </Grid>
                        <Grid
                            className={classes.grid}
                            item
                            container
                            direction="row"
                            justify="space-between"
                            // xs={10}
                        >
                            <Typography variant="subtitle2">
                                Dietary Restrictions
                            </Typography>
                            <Box
                                flexGrow={1}
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Divider className={classes.divider} />
                            </Box>
                            <Typography variant="body1">
                                {userProfile.dietary_restrictions}
                            </Typography>
                        </Grid>
                        <Grid
                            className={classes.grid}
                            item
                            container
                            direction="row"
                            justify="space-between"
                            // xs={10}
                        >
                            <Typography variant="subtitle2">
                                Emergency Contact Info
                            </Typography>
                            <Box
                                flexGrow={1}
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Divider className={classes.divider} />
                            </Box>
                            <Typography variant="body1">
                                {userProfile.emergency_contact}
                            </Typography>
                        </Grid>
                        <Grid
                            className={classes.grid}
                            item
                            container
                            direction="row"
                            justify="space-between"
                            // xs={10}
                        >
                            <Typography variant="subtitle2">
                                Were you a previous volunteer?
                            </Typography>
                            <Box
                                flexGrow={1}
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Divider className={classes.divider} />
                            </Box>
                            <Typography variant="body1">
                                {userProfile.previous_volunteer ? "Yes" : "No"}
                            </Typography>
                        </Grid>
                        <Grid
                            className={classes.grid}
                            item
                            container
                            direction="row"
                            justify="space-between"
                            // xs={10}
                        >
                            <Typography variant="subtitle2">
                                Do you want to claim student volunteer hours?
                            </Typography>
                            <Box
                                flexGrow={1}
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Divider className={classes.divider} />
                            </Box>
                            <Typography variant="body1">
                                {userProfile.student_volunteer_hours
                                    ? "Yes"
                                    : "No"}
                            </Typography>
                        </Grid>
                        <Grid
                            className={classes.grid}
                            item
                            container
                            direction="row"
                            justify="space-between"
                            // xs={10}
                        >
                            <Typography variant="subtitle2">
                                T-shirt size?
                            </Typography>
                            <Box
                                flexGrow={1}
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Divider className={classes.divider} />
                            </Box>
                            <Typography variant="body1">
                                {userProfile.t_shirt_size}
                            </Typography>
                        </Grid>
                    </Paper>
                </TabPanel>
            </Grid>
            <TabPanel value={value} index={1}>
                <Typography variant="h1">Item Two</Typography>
            </TabPanel>
        </Grid>
    );
};

export default ProfilePage;
