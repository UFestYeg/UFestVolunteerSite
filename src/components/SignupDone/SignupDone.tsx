import { Container, Typography } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: theme.spacing(4),
    },
}));

const SignupDone: React.FC = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    return (
        <Container component="main" maxWidth="xs" className={classes.paper}>
            <Typography variant="subtitle1">
                Thanks for your registration, please follow the link sent to
                your provided email to activate your account.
            </Typography>
        </Container>
    );
};

export default SignupDone;
