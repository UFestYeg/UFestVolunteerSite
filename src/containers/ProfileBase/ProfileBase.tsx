import {
    Avatar,
    Grid,
    Paper,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { StateHooks } from "../../store/hooks";
import { Tabs } from "../../components/Tabs";
import { TabProps } from "../../components/Tabs/Tabs";
import { user as userActions } from "../../store/actions";
import { userAvatarString } from "../../store/utils";

interface IProfileBase {
    useTabs: boolean;
    tabs?: TabProps[];
    children?: React.ReactNode;
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
    age: {
        marginLeft: theme.spacing(2),
    },
}));

const ProfilePage: React.FC<IProfileBase> = (props) => {
    const theme = useTheme();
    const { classes } = useStyles();
    const dispatch = StateHooks.useAppDispatch();
    const [cookies, _setCookie] = useCookies(["csrftoken"]);
    const { useTabs, tabs } = props;
    const mobile = !useMediaQuery("(min-width:400px)");
    useEffect(() => {
        dispatch(userActions.getUserProfile(cookies.csrftoken));
    }, [dispatch]);

    const ownUserProfile = StateHooks.useUserProfile();
    const viewedUserProfile = StateHooks.useViewedUserProfile();
    const userProfile = useTabs ? ownUserProfile : viewedUserProfile;

    return (
        <Grid
            className={classes.container}
            container
            spacing={2}
            direction="column"
            justifyContent="center"
            alignItems="center"
        >
            {useTabs && tabs ? (
                <Paper className={classes.paper}>
                    <Tabs tabValues={tabs} />
                </Paper>
            ) : null}

            <Grid
                className={classes.grid}
                container
                item
                spacing={1}
                justifyContent="center"
                alignItems="flex-start"
                direction="column"
                xs={12}
            >
                <Grid
                    container
                    item
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-start"
                    className={classes.heading}
                >
                    <Grid className={classes.grid} item>
                        <Avatar className={classes.large}>
                            {userAvatarString(userProfile)}
                        </Avatar>
                    </Grid>
                    <Grid className={classes.tabPanel} item>
                        <Typography variant={mobile ? "h4" : "h2"}>
                            {userProfile.first_name
                                ? `${userProfile.first_name} ${userProfile.last_name}`
                                : "Firstname Lastname"}
                        </Typography>
                    </Grid>
                </Grid>
                {/* Wrap children as a full-width Grid item so they receive the
                    padding that compensates for the spacing grids' negative
                    margins; otherwise plain children (e.g. the schedule
                    calendar) get shifted left and sit off-centre. */}
                <Grid item xs={12} sx={{ width: "100%" }}>
                    {props.children}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ProfilePage;
