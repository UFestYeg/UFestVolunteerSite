import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import logo from "./ukrainian-dancing.gif";

const NotFoundPage: React.FC = () => {
    return (
        <Grid container direction="column" justify="center" alignItems="center">
            <Grid item xs={12} style={{ marginTop: "20px" }}>
                <img src={logo} alt="Ukrainian Dancing" />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h2">
                    Looks like that page doesn't exist...
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body1" style={{ textAlign: "center" }}>
                    <Link to="/">Go to Home</Link>
                </Typography>
            </Grid>
        </Grid>
    );
};

export default NotFoundPage;
