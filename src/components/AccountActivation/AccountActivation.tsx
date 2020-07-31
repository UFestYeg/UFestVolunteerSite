// tslint:disable: jsx-no-lambda
// tslint:disable: react-this-binding-issue
// tslint:disable: use-simple-attributes

import {
    Avatar,
    Button,
    CircularProgress,
    Container,
    Typography,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { CheckCircleOutline as CheckCircleOutlineIcon } from "@material-ui/icons";
import { Form, Formik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { auth } from "../../store/actions";
import { StateHooks } from "../../store/hooks";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: theme.spacing(4),
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    textField: {
        "& label": {
            color: "grey",
        },
    },
    checkbox: {
        "& input": {
            color: theme.palette.primary.main,
        },
    },
}));

const AccountActivation: React.FC = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();
    const { key } = useParams();
    const [loading, isAuthenticated, error] = StateHooks.useAuthInfo();

    const errorMessage: any[] = [];
    if (error) {
        Object.entries(error.response.data).forEach((e) => {
            const errorMarkup = (
                <Typography variant="body1" color="error">
                    {`${e[0]}: ${e[1]}`}
                </Typography>
            );
            errorMessage.push(errorMarkup);
        });
    }

    const handleFormSubmit = () => {
        dispatch(auth.activateUserAccount(key));
    };
    return (
        <Container component="main" maxWidth="xs">
            {errorMessage}
            {loading ? (
                <CircularProgress />
            ) : (
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <CheckCircleOutlineIcon />
                    </Avatar>
                    <Typography component="h1" variant="h4">
                        Please click the button below to activate your account
                    </Typography>

                    <Formik
                        initialValues={{}}
                        onSubmit={(_values, { setSubmitting }) => {
                            setTimeout(() => {
                                // alert(JSON.stringify(values, null, 2));
                                handleFormSubmit();
                                setSubmitting(false);
                            }, 400);
                        }}
                    >
                        {({ handleSubmit, isSubmitting, isValid }) => (
                            <Form
                                className={classes.form}
                                onSubmit={handleSubmit}
                            >
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !isValid}
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Activate
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}
        </Container>
    );
};

export default AccountActivation;
