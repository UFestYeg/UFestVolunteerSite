// tslint:disable: jsx-no-lambda
// tslint:disable: react-this-binding-issue
// tslint:disable: use-simple-attributes
import { Container, Typography } from "@material-ui/core";
import React from "react";

const PasswordResetDone: React.FC = () => {
    return (
        <Container component="main" maxWidth="xs">
            <Typography variant="h3">
                A password reset email has been sent to your email. Please
                follow the link to reset your password.
            </Typography>
        </Container>
    );
};

export default PasswordResetDone;
