import { Grid, useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles({
    loading: {
        backgroundColor: "#28352E",
        height: "100vh",
        width: "100vw",
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
            <img
                src={"./Loading.gif"}
                alt="Loading"
                width={width}
                height={width}
            />
        </Grid>
    );
};

export default Loading;
