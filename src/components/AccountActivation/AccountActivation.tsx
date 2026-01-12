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
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { auth } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import { buildErrorMessage } from "../../store/utils";

const useStyles = makeStyles((theme) => ({
    avatar: {
        backgroundColor: theme.palette.secondary.main,
        margin: theme.spacing(1),
    },
    paper: {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        marginTop: theme.spacing(8),
        padding: theme.spacing(4),
    },
    form: {
        marginTop: theme.spacing(1),
        width: "100%", // Fix IE 11 issue.
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
    const { key } = useParams<{ key: string }>();
    const [loading, isAuthenticated, error] = StateHooks.useAuthInfo();
    const [cookies, _setCookie] = useCookies(["csrftoken"]);

    const errorMessage: any[] = buildErrorMessage(error);

    const handleFormSubmit = () => {
        dispatch(auth.activateUserAccount(key, cookies.csrftoken));
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
