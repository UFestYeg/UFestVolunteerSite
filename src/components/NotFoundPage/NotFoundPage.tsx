import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { StateHooks } from "../../store/hooks";
import logo from "./ukrainian-dancing.gif";

const NotFoundPage: React.FC = () => {
    const isAuthenticated = StateHooks.useIsAuthenticated();
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
                    <Link to={isAuthenticated ? "/volunteer" : "/"}>
                        Go to Home
                    </Link>
                </Typography>
            </Grid>
        </Grid>
    );
};

export default NotFoundPage;
