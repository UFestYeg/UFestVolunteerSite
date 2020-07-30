// tslint:disable: jsx-no-lambda
// tslint:disable: react-this-binding-issue
// tslint:disable: use-simple-attributes

import {
    Button,
    CircularProgress,
    Container,
    TextField,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Form, Formik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import * as Yup from "yup";
import { auth } from "../../store/actions";
import { StateHooks } from "../../store/hooks";

interface IResetPasswordFormValues {
    password: string;
    confirmPassword: string;
}

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

const PasswordReset: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const location = useLocation();
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

    const handleFormSubmit = (values: IResetPasswordFormValues) => {
        console.log(values);
        const password = values.password;
        const confirmPassword = values.confirmPassword;

        dispatch(auth.confirmPasswordChange(password, confirmPassword));
    };

    return (
        <Container component="main" maxWidth="xs">
            {errorMessage}
            {loading ? (
                <CircularProgress />
            ) : (
                <Formik
                    initialValues={{
                        password: "",
                        confirmPassword: "",
                    }}
                    validationSchema={Yup.object({
                        password: Yup.string()
                            .min(8, "Must be more than 8 characters")
                            .required("Required"),
                        confirmPassword: Yup.string()
                            .oneOf(
                                [Yup.ref("password"), undefined],
                                "Passwords don't match"
                            )
                            .required("Confirm Password is required"),
                    })}
                    onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                            // alert(JSON.stringify(values, null, 2));
                            handleFormSubmit(values);
                            setSubmitting(false);
                        }, 400);
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldValue,
                        isSubmitting,
                        isValid,
                    }) => (
                        <Form className={classes.form} onSubmit={handleSubmit}>
                            <Typography component="h1" variant="h4">
                                Create New Password
                            </Typography>
                            <hr />

                            <TextField
                                className={classes.textField}
                                color="primary"
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="New Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={
                                    errors.password && touched.password
                                        ? errors.password
                                        : ""
                                }
                                error={
                                    touched.password && Boolean(errors.password)
                                }
                            />
                            <TextField
                                className={classes.textField}
                                color="primary"
                                variant="outlined"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                id="confirmPassword"
                                autoComplete="confirm-password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={
                                    errors.confirmPassword &&
                                    touched.confirmPassword
                                        ? errors.confirmPassword
                                        : ""
                                }
                                error={
                                    touched.confirmPassword &&
                                    Boolean(errors.confirmPassword)
                                }
                            />

                            <Button
                                type="submit"
                                disabled={isSubmitting || !isValid}
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Submit
                            </Button>
                        </Form>
                    )}
                </Formik>
            )}
        </Container>
    );
};

export default PasswordReset;
