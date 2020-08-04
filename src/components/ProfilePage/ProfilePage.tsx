import { Avatar, Button, Grid, Typography } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { user as userActions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import { userAvatarString } from "../../store/utils";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    large: {
        width: theme.spacing(8),
        height: theme.spacing(8),
    },
    grid: {
        border: "1px solid black",
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
    const token = StateHooks.useToken();

    useEffect(() => {
        dispatch(userActions.getUserProfile()).then(
            ({ payload }: userActions.ActionType) => {
                if (token && process.env["REACT_APP_API_URI"] !== undefined) {
                    axios.defaults.headers = {
                        Authorization: token,
                        "Content-Type": "application/json",
                    };

                    axios
                        .get(`${process.env["REACT_APP_API_URI"]}api/users`)
                        .then((res) => {
                            setList(res.data);
                            console.log(res.data);
                        });
                }
            }
        );
    }, [dispatch, token]);

    const userProfile = StateHooks.useUserProfile();
    console.log(userProfile);
    return (
        <Grid
            className={classes.grid}
            container
            spacing={2}
            direction="row"
            justify="center"
            alignItems="flex-start"
        >
            <Grid className={classes.grid} item xs={4}>
                <Avatar className={classes.large}>
                    {userAvatarString(userProfile)}
                </Avatar>
            </Grid>
            <Grid className={classes.grid} item xs={8}>
                <Grid
                    className={classes.grid}
                    container
                    spacing={1}
                    justify="center"
                    alignItems="flex-start"
                >
                    <Grid className={classes.grid} item xs={12}>
                        <Typography>
                            {userProfile.first_name
                                ? `${userProfile.first_name} ${userProfile.last_name}`
                                : "Firstname Lastname"}
                        </Typography>
                    </Grid>
                    <Grid className={classes.grid} item xs={12}>
                        Other info
                    </Grid>
                    <Grid className={classes.grid} item xs={12}>
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
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ProfilePage;
