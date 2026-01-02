// tslint:disable: jsx-no-lambda
// tslint:disable: react-this-binding-issue
// tslint:disable: use-simple-attributes

import {
    Avatar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from "@material-ui/core";
// tslint:disable-next-line: no-submodule-imports
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
    Lock as LockIcon,
    Visibility,
    VisibilityOff,
} from "@material-ui/icons";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { auth } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import { buildErrorMessage } from "../../store/utils";

interface IResetPasswordFormValues {
    password: string;
    confirmPassword: string;
}

const useStyles = makeStyles((theme) => ({
    avatar: {
        backgroundColor: theme.palette.secondary.main,
        margin: theme.spacing(1),
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
}));

const PasswordReset: React.FC = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();
    const { uid, token } = useParams<{ uid: string; token: string }>();
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

    const errorMessage: any[] = buildErrorMessage(error);

    const handleFormSubmit = (values: IResetPasswordFormValues) => {
        const password = values.password;
        const confirmPassword = values.confirmPassword;

        dispatch(
            auth.confirmPasswordChange(
                uid,
                token,
                password,
                confirmPassword,
                cookies.csrftoken
            )
        );
    };

    return (
        <Container component="main" maxWidth="xs">
            {errorMessage}
            {loading ? (
                <CircularProgress />
            ) : (
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockIcon />
                    </Avatar>
                    <Typography component="h1" variant="h4">
                        Create New Password
                    </Typography>
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
                            <Form
                                className={classes.form}
                                onSubmit={handleSubmit}
                            >
                                <TextField
                                    autoFocus
                                    className={classes.textField}
                                    variant="outlined"
                                    color="primary"
                                    margin="normal"
                                    fullWidth
                                    required
                                    name="password"
                                    label="New Password"
                                    id="password"
                                    type={showPassword1 ? "text" : "password"}
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
                                        errors.password && touched.password
                                            ? errors.password
                                            : ""
                                    }
                                />
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
                                    type={showPassword2 ? "text" : "password"}
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
                                        Boolean(errors.confirmPassword)
                                    }
                                    helperText={
                                        errors.confirmPassword &&
                                        touched.confirmPassword
                                            ? errors.confirmPassword
                                            : ""
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
                </div>
            )}
        </Container>
    );
};

export default PasswordReset;
