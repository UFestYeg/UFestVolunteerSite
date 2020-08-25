import { Grid, Typography, useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import logo from "./Loading.gif";

const useStyles = makeStyles({
    loading: {
        height: "100%",
        width: "100%",
    },
});

const Loading = () => {
    const classes = useStyles();

    const small = useMediaQuery("(min-width: 400px) and (max-width: 700px)");
    const medium = useMediaQuery("(min-width: 700px) and (max-width: 900px)");
    const large = useMediaQuery("(min-width: 900px)");

    let width: number;
    if (small) {
        width = 400;
    } else if (medium) {
        width = 700;
    } else if (large) {
        width = 800;
    } else {
        width = 300;
    }

    return (
        <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
            className={classes.loading}
        >
            <Grid item>
                <Typography variant="h1">Loading...</Typography>
            </Grid>
            <img src={logo} alt="Loading" width={width} height={width} />
        </Grid>
    );
};

export default Loading;
