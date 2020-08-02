// tslint:disable: jsx-no-lambda
// tslint:disable: react-this-binding-issue
// tslint:disable: use-simple-attributes

import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    Link,
    TextField,
    Typography,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { LockOutlined as LockOutlinedIcon } from "@material-ui/icons";
import { Form, Formik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";
import * as Yup from "yup";
import { auth as actions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import Copyright from "../Copyright";

interface ILoginFormValues {
    username: string;
    password: string;
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

const SignIn: React.FC = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();
    const location = useLocation();
    const [loading, isAuthenticated, error] = StateHooks.useAuthInfo();

    const handleFormSubmit = (values: ILoginFormValues) => {
        const username = values.username;
        const password = values.password;

        dispatch(actions.authLogin(username, password));
    };

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

    return (
        <Container component="main" maxWidth="xs">
            {isAuthenticated ? (
                <Redirect
                    to={{
                        pathname: "/volunteer/events",
                        state: {
                            from: location,
                        },
                    }}
                />
            ) : (
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    {errorMessage}
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <Formik
                            initialValues={{
                                password: "",
                                username: "",
                            }}
                            validationSchema={Yup.object({
                                username: Yup.string().required("Required"),
                                password: Yup.string()
                                    .min(8, "Must be more than 8 characters")
                                    .required("Required"),
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
                                <Form
                                    className={classes.form}
                                    onSubmit={handleSubmit}
                                >
                                    <TextField
                                        className={classes.textField}
                                        variant="outlined"
                                        color="primary"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="username"
                                        label="User Name"
                                        name="username"
                                        autoComplete="username"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={
                                            errors.username && touched.username
                                                ? errors.username
                                                : ""
                                        }
                                        error={
                                            touched.username &&
                                            Boolean(errors.username)
                                        }
                                        value={values.username}
                                        autoFocus
                                    />
                                    <TextField
                                        className={classes.textField}
                                        variant="outlined"
                                        color="primary"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
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
                                            touched.password &&
                                            Boolean(errors.password)
                                        }
                                        value={values.password}
                                    />
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || !isValid}
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        className={classes.submit}
                                    >
                                        Sign In
                                    </Button>
                                    <Grid container direction="column">
                                        <Grid item xs={12}>
                                            <Link
                                                href="/reset_password"
                                                variant="body2"
                                            >
                                                Forgot password?
                                            </Link>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Link
                                                href="/signup"
                                                variant="body2"
                                            >
                                                {
                                                    "Don't have an account? Sign Up"
                                                }
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </Form>
                            )}
                        </Formik>
                    )}
                </div>
            )}
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
};

export default SignIn;
