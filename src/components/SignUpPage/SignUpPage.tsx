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
    IconButton,
    InputAdornment,
    Link,
    TextField,
    Typography,
} from "@material-ui/core";
// tslint:disable-next-line: no-submodule-imports
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
    LockOutlined as LockOutlinedIcon,
    Visibility,
    VisibilityOff,
} from "@material-ui/icons";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";
import * as Yup from "yup";
import { auth as actions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import { buildErrorMessage } from "../../store/utils";
import Copyright from "../Copyright";

interface ISignupFormValues {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

const useStyles = makeStyles((theme) => ({
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    checkbox: {
        "& input": {
            color: theme.palette.primary.main,
        },
    },
    paper: {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        marginTop: theme.spacing(8),
        padding: theme.spacing(4),
    },
    textField: {
        "& label": {
            color: "grey",
        },
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const SignUp: React.FC = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();
    const [loading, isAuthenticated, error] = StateHooks.useAuthInfo();
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [cookies, _setCookie] = useCookies(["csrftoken"]);

    const handleClickShowPassword1 = () => {
        setShowPassword1((oldShowPassword: boolean) => !oldShowPassword);
    };
    const handleClickShowPassword2 = () => {
        setShowPassword2((oldShowPassword: boolean) => !oldShowPassword);
    };

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    const handleFormSubmit = (values: ISignupFormValues) => {
        const firstName = values.firstName;
        const lastName = values.lastName;
        const username = values.username;
        const email = values.email;
        const password = values.password;
        const confirmPassword = values.confirmPassword;

        dispatch(
            actions.authSignup(
                firstName,
                lastName,
                username,
                email,
                password,
                confirmPassword,
                cookies.csrftoken
            )
        );
    };

    const location = useLocation();

    const errorMessage: any[] = buildErrorMessage(error);

    return (
        <Container component="main" maxWidth="xs">
            {isAuthenticated ? (
                <Redirect
                    to={{
                        pathname: "/volunteer",
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
                        Sign up
                    </Typography>
                    {errorMessage}
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <Formik
                            initialValues={{
                                firstName: "",
                                lastName: "",
                                username: "",
                                email: "",
                                password: "",
                                confirmPassword: "",
                            }}
                            validationSchema={Yup.object({
                                firstName: Yup.string().required("Required."),
                                lastName: Yup.string().required("Required."),
                                username: Yup.string().required("Required."),
                                email: Yup.string()
                                    .email("Invalid email address")
                                    .required("Required"),
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
                                <Form
                                    className={classes.form}
                                    onSubmit={handleSubmit}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                autoComplete="fname"
                                                className={classes.textField}
                                                color="primary"
                                                name="firstName"
                                                variant="outlined"
                                                required
                                                fullWidth
                                                id="firstName"
                                                label="First Name"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                helperText={
                                                    errors.firstName &&
                                                    touched.firstName
                                                        ? errors.firstName
                                                        : ""
                                                }
                                                error={
                                                    touched.firstName &&
                                                    Boolean(errors.firstName)
                                                }
                                                value={values.firstName}
                                                autoFocus
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                className={classes.textField}
                                                color="primary"
                                                variant="outlined"
                                                required
                                                fullWidth
                                                id="lastName"
                                                label="Last Name"
                                                name="lastName"
                                                autoComplete="lname"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                helperText={
                                                    errors.lastName &&
                                                    touched.lastName
                                                        ? errors.lastName
                                                        : ""
                                                }
                                                error={
                                                    touched.lastName &&
                                                    Boolean(errors.lastName)
                                                }
                                                value={values.lastName}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                className={classes.textField}
                                                color="primary"
                                                variant="outlined"
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
                                                    errors.username &&
                                                    touched.username
                                                        ? errors.username
                                                        : ""
                                                }
                                                error={
                                                    touched.username &&
                                                    Boolean(errors.username)
                                                }
                                                value={values.username}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                className={classes.textField}
                                                color="primary"
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="email"
                                                type="email"
                                                label="Email Address"
                                                name="email"
                                                autoComplete="email"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                helperText={
                                                    errors.email &&
                                                    touched.email
                                                        ? errors.email
                                                        : ""
                                                }
                                                error={
                                                    touched.email &&
                                                    Boolean(errors.email)
                                                }
                                                value={values.email}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                className={classes.textField}
                                                variant="outlined"
                                                color="primary"
                                                margin="normal"
                                                fullWidth
                                                required
                                                name="password"
                                                label="Password"
                                                id="password"
                                                type={
                                                    showPassword1
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={values.password}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle old password visibility"
                                                                onClick={
                                                                    handleClickShowPassword1
                                                                }
                                                                onMouseDown={
                                                                    handleMouseDownPassword
                                                                }
                                                                edge="end"
                                                            >
                                                                {showPassword1 ? (
                                                                    <Visibility />
                                                                ) : (
                                                                    <VisibilityOff />
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                error={
                                                    touched.password &&
                                                    Boolean(errors.password)
                                                }
                                                helperText={
                                                    errors.password &&
                                                    touched.password
                                                        ? errors.password
                                                        : ""
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                className={classes.textField}
                                                variant="outlined"
                                                color="primary"
                                                margin="normal"
                                                fullWidth
                                                required
                                                name="confirmPassword"
                                                label="Confirm Password"
                                                id="confirmPassword"
                                                type={
                                                    showPassword2
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={values.confirmPassword}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle old password visibility"
                                                                onClick={
                                                                    handleClickShowPassword2
                                                                }
                                                                onMouseDown={
                                                                    handleMouseDownPassword
                                                                }
                                                                edge="end"
                                                            >
                                                                {showPassword2 ? (
                                                                    <Visibility />
                                                                ) : (
                                                                    <VisibilityOff />
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                error={
                                                    touched.confirmPassword &&
                                                    Boolean(
                                                        errors.confirmPassword
                                                    )
                                                }
                                                helperText={
                                                    errors.confirmPassword &&
                                                    touched.confirmPassword
                                                        ? errors.confirmPassword
                                                        : ""
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || !isValid}
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        className={classes.submit}
                                    >
                                        Sign Up
                                    </Button>
                                    <Grid
                                        container
                                        direction="column"
                                        justify="flex-end"
                                    >
                                        <Grid item xs={12}>
                                            <Link href="/login" variant="body2">
                                                Already have an account? Sign in
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </Form>
                            )}
                        </Formik>
                    )}
                </div>
            )}
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    );
};

export default SignUp;
