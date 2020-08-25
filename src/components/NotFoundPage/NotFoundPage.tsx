import { Grid, Typography, useMediaQuery } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { StateHooks } from "../../store/hooks";
import logo from "./ukrainian_dancer.gif";

const NotFoundPage: React.FC = () => {
    const isAuthenticated = StateHooks.useIsAuthenticated();

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
        <Grid container direction="column" justify="center" alignItems="center">
            <Grid item xs={12} style={{ marginTop: "20px" }}>
                <img
                    src={logo}
                    alt="Ukrainian Dancing"
                    width={width}
                    height={width}
                />
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
