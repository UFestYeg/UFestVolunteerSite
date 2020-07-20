// tslint:disable: jsx-no-lambda
// tslint:disable: react-this-binding-issue
// tslint:disable: use-simple-attributes

import {
    Avatar,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Container,
    FormControlLabel,
    Grid,
    Link,
    TextField,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { LockOutlined as LockOutlinedIcon } from "@material-ui/icons";
import { Form, Formik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { auth as actions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import Copyright from "../Copyright";

interface ISignupFormValues {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const SignUp: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [loading, error] = StateHooks.useFormFields();

    const handleFormSubmit = (values: ISignupFormValues) => {
        console.log(values.username);
        const username = values.username;
        const email = values.email;
        const password = values.password;
        const confirmPassword = values.confirmPassword;

        dispatch(
            actions.authSignup(username, email, password, confirmPassword)
        );
    };

    const history = useHistory();

    let errorMessage = null;
    if (error) {
        errorMessage = (
            <Typography variant="body1" color="error">
                {error.message}
            </Typography>
        );
    }

    return (
        <Container component="main" maxWidth="xs">
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
                            username: "",
                            email: "",
                            password: "",
                            confirmPassword: "",
                        }}
                        validationSchema={Yup.object({
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
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            setTimeout(() => {
                                // alert(JSON.stringify(values, null, 2));
                                handleFormSubmit(values);
                                setSubmitting(false);
                                history.push("/events");
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
                            <Form className={classes.form}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
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
                                            autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
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
                                                errors.email && touched.email
                                                    ? errors.email
                                                    : ""
                                            }
                                            error={
                                                touched.email &&
                                                Boolean(errors.email)
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined"
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
                                                errors.password &&
                                                touched.password
                                                    ? errors.password
                                                    : ""
                                            }
                                            error={
                                                touched.password &&
                                                Boolean(errors.password)
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
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
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    value="allowExtraEmails"
                                                    color="primary"
                                                />
                                            }
                                            label="I want to receive marketing promotions and updates via email."
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
                                <Grid container justify="flex-end">
                                    <Grid item>
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
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    );
};

export default SignUp;
