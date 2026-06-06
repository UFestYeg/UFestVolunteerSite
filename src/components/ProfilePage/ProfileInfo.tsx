import {
    Box,
    Button,
    Divider,
    Grid,
    Paper,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import clsx from "clsx";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { StateHooks } from "../../store/hooks";
import { Link, useParams } from "react-router-dom";
import { user as userActions } from "../../store/actions";

interface IProfileInfo {
    canEdit: boolean;
}

const useStyles = makeStyles()((theme) => ({
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
        border: 0,
        borderRadius: theme.spacing(2),
        // color: "white",
        // fontSize uses !important because the theme's typography.button
        // (1.3rem) is injected after this tss-react class and would otherwise
        // win the cascade, keeping the label large.
        fontSize: "0.7rem !important",
        paddingBlock: theme.spacing(0.85),
        paddingInline: theme.spacing(2),
        minWidth: 0,
        margin: theme.spacing(1),
        whiteSpace: "nowrap",
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
        [theme.breakpoints.down('lg')]: {
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
    const { classes } = useStyles();
    const dispatch = StateHooks.useAppDispatch();
    const { profileID: profileIDStr } = useParams<{ profileID?: string }>();
    const profileID = profileIDStr ? parseInt(profileIDStr, 10) : undefined;
    const [cookies, _setCookie] = useCookies(["csrftoken"]);
    const mobile = !useMediaQuery("(min-width:400px)");
    const flexDirection = mobile ? "column" : "row";
    useEffect(() => {
        if (typeof profileID === "number" && !Number.isNaN(profileID)) {
            dispatch(userActions.getUserProfile(cookies.csrftoken, profileID));
        }
    }, [cookies.csrftoken, dispatch, profileID]);

    const viewedUserProfile = StateHooks.useViewedUserProfile();
    const ownUserProfile = StateHooks.useUserProfile();
    const userProfile = profileID ? viewedUserProfile : ownUserProfile;

    return (
        <Paper elevation={3} className={classes.fullWidth}>
            <Grid
                className={classes.grid}
                item
                container
                direction="row"
                justifyContent="space-between"
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
                            alignItems="flex-end"
                            justifyContent="flex-start"
                            xs={12}
                            sm="auto"
                            sx={{ maxWidth: "100% !important", flexShrink: 1 }}
                        >
                            <Button
                                size="small"
                                className={clsx(classes.change, classes.button)}
                                component={Link}
                                to={"/volunteer/profile/change_password"}
                                color="secondary"
                                variant="contained"
                                disableElevation
                                sx={{ lineHeight: 1.4 }}
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
                                sx={{ lineHeight: 1.4 }}
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
                justifyContent="space-between"
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
                justifyContent="space-between"
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
                    justifyContent="space-between"
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
                justifyContent="space-between"
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
                justifyContent="space-between"
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
                justifyContent="space-between"
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
                justifyContent="space-between"
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
                justifyContent="space-between"
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
                justifyContent="space-between"
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
            {userProfile.special_interests &&
            userProfile.special_interests.trim() ? (
                <Grid
                    className={classes.grid}
                    item
                    container
                    direction={flexDirection}
                    justifyContent="space-between"
                >
                    <Typography variant="subtitle2">
                        Special Interests
                    </Typography>
                    <Box
                        flexGrow={1}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Divider className={classes.divider} />
                    </Box>
                    <Typography variant="body1">
                        {userProfile.special_interests}
                    </Typography>
                </Grid>
            ) : null}
            {userProfile.comments && userProfile.comments.trim() ? (
                <Grid
                    className={classes.grid}
                    item
                    container
                    direction={flexDirection}
                    justifyContent="space-between"
                >
                    <Typography variant="subtitle2">Comments</Typography>
                    <Box
                        flexGrow={1}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Divider className={classes.divider} />
                    </Box>
                    <Typography variant="body1">
                        {userProfile.comments}
                    </Typography>
                </Grid>
            ) : null}
        </Paper>
    );
};

export default ProfileInfo;
