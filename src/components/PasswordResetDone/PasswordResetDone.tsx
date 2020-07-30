// tslint:disable: jsx-no-lambda
// tslint:disable: react-this-binding-issue
// tslint:disable: use-simple-attributes
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

const PasswordResetDone: React.FC = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    return (
        <Container component="main" maxWidth="xs" className={classes.paper}>
            <Typography variant="subtitle1">
                A password reset email has been sent to your email. Please
                follow the link to reset your password.
            </Typography>
        </Container>
    );
};

export default PasswordResetDone;
