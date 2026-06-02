import { Container, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import React from "react";

const useStyles = makeStyles()((theme) => ({
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
    const { classes } = useStyles();
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
