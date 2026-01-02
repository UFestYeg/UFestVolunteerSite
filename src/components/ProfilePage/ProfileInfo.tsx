import {
    Box,
    Button,
    Divider,
    Grid,
    Paper,
    Typography,
    useMediaQuery,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { user as userActions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";

interface IProfileInfo {
    canEdit: boolean;
}

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
        [theme.breakpoints.up("md")]: {
            marginLeft: theme.spacing(4),
        },
        [theme.breakpoints.down("md")]: {
            marginLeft: theme.spacing(2),
        },
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
    age: {
        marginLeft: theme.spacing(2),
    },
}));

const ProfileInfo: React.FC<IProfileInfo> = ({ canEdit }) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();
    const { profileID: profileIDStr } = useParams<{ profileID: string }>();
    const profileID = profileIDStr ? parseInt(profileIDStr) : undefined;
    const [cookies, _setCookie] = useCookies(["csrftoken"]);
    const mobile = !useMediaQuery("(min-width:400px)");
    const flexDirection = mobile ? "column" : "row";
    useEffect(() => {
        if (typeof profileID === "number" && !Number.isNaN(profileID)) {
            dispatch(
                userActions.getUserProfile(
                    cookies.csrftoken,
                    profileID
                )
            );
        }
    }, [cookies.csrftoken, dispatch, profileID]);

    const userProfile = profileID
        ? StateHooks.useViewedUserProfile()
        : StateHooks.useUserProfile();

    return (
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
                {canEdit ? (
                    <>
                        <Divider
                            orientation={mobile ? "horizontal" : "vertical"}
                            flexItem
                        />
                        <Grid
                            item
                            container
                            direction="column"
                            alignItems="stretch"
                            justify="flex-start"
                            xs={12}
                            sm={3}
                        >
                            <Button
                                size="small"
                                className={clsx(classes.change, classes.button)}
                                component={Link}
                                to={"/volunteer/profile/change_password"}
                                color="secondary"
                                variant="contained"
                                disableElevation
                            >
                                Change Password
                            </Button>

                            <Button
                                size="small"
                                className={clsx(classes.change, classes.button)}
                                component={Link}
                                to={"/volunteer/profile/edit"}
                                color="secondary"
                                variant="contained"
                                disableElevation
                            >
                                Edit Profile
                            </Button>
                        </Grid>
                    </>
                ) : null}
            </Grid>
            <Grid
                className={classes.grid}
                item
                container
                direction={flexDirection}
                justify="space-between"
                // xs={10}
            >
                <Typography variant="subtitle2">Email</Typography>
                <Box flexGrow={1} alignItems="center" justifyContent="center">
                    <Divider className={classes.divider} />
                </Box>
                <Typography variant="body1">{userProfile.email}</Typography>
            </Grid>
            <Grid
                className={classes.grid}
                item
                container
                direction={flexDirection}
                justify="space-between"
                // xs={10}
            >
                <Typography variant="subtitle2">Username</Typography>
                <Box flexGrow={1} alignItems="center" justifyContent="center">
                    <Divider className={classes.divider} />
                </Box>
                <Typography variant="body1">{userProfile.username}</Typography>
            </Grid>
            {!userProfile.over_eighteen && userProfile.age ? (
                <Grid
                    className={classes.grid}
                    item
                    container
                    direction={flexDirection}
                    justify="space-between"
                    // xs={10}
                >
                    <Typography variant="subtitle2">Over 18?</Typography>
                    <Box
                        flexGrow={1}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Divider style={{ margin: "4%" }} />
                    </Box>
                    <Typography variant="body1">No</Typography>
                    <Typography className={classes.age} variant="subtitle2">
                        Age
                    </Typography>
                    <Box
                        flexGrow={1}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Divider style={{ margin: "4%" }} />
                    </Box>
                    <Typography variant="body1">{userProfile.age}</Typography>
                </Grid>
            ) : null}
            <Grid
                className={classes.grid}
                item
                container
                direction={flexDirection}
                justify="space-between"
                // xs={10}
            >
                <Typography variant="subtitle2">
                    Medical Restrictions
                </Typography>
                <Box flexGrow={1} alignItems="center" justifyContent="center">
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
                direction={flexDirection}
                justify="space-between"
                // xs={10}
            >
                <Typography variant="subtitle2">
                    Dietary Restrictions
                </Typography>
                <Box flexGrow={1} alignItems="center" justifyContent="center">
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
                direction={flexDirection}
                justify="space-between"
                // xs={10}
            >
                <Typography variant="subtitle2">
                    Emergency Contact Info
                </Typography>
                <Box flexGrow={1} alignItems="center" justifyContent="center">
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
                direction={flexDirection}
                justify="space-between"
                // xs={10}
            >
                <Typography variant="subtitle2">
                    Were you a previous volunteer?
                </Typography>
                <Box flexGrow={1} alignItems="center" justifyContent="center">
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
                direction={flexDirection}
                justify="space-between"
                // xs={10}
            >
                <Typography variant="subtitle2">
                    Do you want to claim student volunteer hours?
                </Typography>
                <Box flexGrow={1} alignItems="center" justifyContent="center">
                    <Divider className={classes.divider} />
                </Box>
                <Typography variant="body1">
                    {userProfile.student_volunteer_hours ? "Yes" : "No"}
                </Typography>
            </Grid>
            <Grid
                className={classes.grid}
                item
                container
                direction={flexDirection}
                justify="space-between"
                // xs={10}
            >
                <Typography variant="subtitle2">T-shirt size?</Typography>
                <Box flexGrow={1} alignItems="center" justifyContent="center">
                    <Divider className={classes.divider} />
                </Box>
                <Typography variant="body1">
                    {userProfile.t_shirt_size}
                </Typography>
            </Grid>
        </Paper>
    );
};

export default ProfileInfo;
