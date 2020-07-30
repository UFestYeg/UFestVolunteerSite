import { Avatar, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { user as userActions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import { userAvatarString } from "../../store/utils";

const useStyles = makeStyles((theme) => ({
    large: {
        width: theme.spacing(8),
        height: theme.spacing(8),
    },
    grid: {
        border: "1px solid black",
        marginTop: theme.spacing(2),
    },
}));

const ProfilePage: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userActions.getUserProfile());
    }, [dispatch]);

    const userProfile = StateHooks.useUserProfile();
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
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ProfilePage;
