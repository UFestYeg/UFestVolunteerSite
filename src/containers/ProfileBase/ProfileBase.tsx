import {
    Avatar,
    Grid,
    Paper,
    Typography,
    useMediaQuery,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { Tabs } from "../../components/Tabs";
import { TabProps } from "../../components/Tabs/Tabs";
import { user as userActions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import { userAvatarString } from "../../store/utils";

interface IProfileBase {
    useTabs: boolean;
    tabs?: TabProps[];
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
    const classes = useStyles(theme);
    const dispatch = useDispatch();
    const [cookies, _setCookie] = useCookies(["csrftoken"]);
    const { useTabs, tabs } = props;
    const mobile = !useMediaQuery("(min-width:400px)");
    useEffect(() => {
        dispatch(userActions.getUserProfile(cookies.csrftoken));
    }, [dispatch]);

    const userProfile = useTabs
        ? StateHooks.useUserProfile()
        : StateHooks.useViewedUserProfile();

    return (
        <Grid
            className={classes.container}
            container
            spacing={2}
            direction="column"
            justify="center"
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
                        <Typography variant={mobile ? "h4" : "h2"}>
                            {userProfile.first_name
                                ? `${userProfile.first_name} ${userProfile.last_name}`
                                : "Firstname Lastname"}
                        </Typography>
                    </Grid>
                </Grid>
                {props.children}
            </Grid>
        </Grid>
    );
};

export default ProfilePage;
