import React from "react";
import { Typography, Grid, Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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
                <Avatar className={classes.large}>OP</Avatar>
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
                        FirstName LastName
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
