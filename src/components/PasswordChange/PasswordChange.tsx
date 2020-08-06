// tslint:disable: jsx-no-lambda
// tslint:disable: react-this-binding-issue
// tslint:disable: use-simple-attributes
import {
    Avatar,
    Button,
    CircularProgress,
    Container,
    InputAdornment,
    IconButton,
    TextField,
    Typography,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
    SwapHoriz as SwapHorizIcon,
    Visibility,
    VisibilityOff,
} from "@material-ui/icons";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { auth } from "../../store/actions";
import { StateHooks } from "../../store/hooks";

interface IResetPasswordFormValues {
    old_password: string;
    new_password1: string;
    new_password2: string;
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

const PasswordChange: React.FC = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();
    const [loading, isAuthenticated, error] = StateHooks.useAuthInfo();
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [showPassword3, setShowPassword3] = useState(false);

    const handleClickShowPassword1 = () => {
        setShowPassword1((oldShowPassword: boolean) => !oldShowPassword);
    };
    const handleClickShowPassword2 = () => {
        setShowPassword2((oldShowPassword: boolean) => !oldShowPassword);
    };
    const handleClickShowPassword3 = () => {
        setShowPassword3((oldShowPassword: boolean) => !oldShowPassword);
    };

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
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

    const handleFormSubmit = (values: IResetPasswordFormValues) => {
        const old_password = values.old_password;
        const new_password1 = values.new_password1;
        const new_password2 = values.new_password2;

        dispatch(
            auth.changePassword(old_password, new_password1, new_password2)
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
                        <SwapHorizIcon />
                    </Avatar>
                    <Typography component="h1" variant="h4">
                        Change Password
                    </Typography>

                    <Formik
                        initialValues={{
                            old_password: "",
                            new_password1: "",
                            new_password2: "",
                        }}
                        validationSchema={Yup.object({
                            old_password: Yup.string()
                                .min(8, "Must be more than 8 characters")
                                .required("Required"),
                            new_password1: Yup.string()
                                .min(8, "Must be more than 8 characters")
                                .required("Required"),
                            new_password2: Yup.string()
                                .oneOf(
                                    [Yup.ref("new_password1"), undefined],
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
                                    name="old_password"
                                    label="Old Password"
                                    id="old_password"
                                    type={showPassword1 ? "text" : "password"}
                                    value={values.old_password}
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
                                        touched.old_password &&
                                        Boolean(errors.old_password)
                                    }
                                    helperText={
                                        errors.old_password &&
                                        touched.old_password
                                            ? errors.old_password
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
                                    name="new_password1"
                                    label="New Password"
                                    id="new_password1"
                                    type={showPassword2 ? "text" : "password"}
                                    value={values.new_password1}
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
                                        touched.new_password1 &&
                                        Boolean(errors.new_password1)
                                    }
                                    helperText={
                                        errors.new_password1 &&
                                        touched.new_password1
                                            ? errors.new_password1
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
                                    name="new_password2"
                                    label="Confirm Password"
                                    id="new_password2"
                                    type={showPassword3 ? "text" : "password"}
                                    value={values.new_password2}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle old password visibility"
                                                    onClick={
                                                        handleClickShowPassword3
                                                    }
                                                    onMouseDown={
                                                        handleMouseDownPassword
                                                    }
                                                    edge="end"
                                                >
                                                    {showPassword3 ? (
                                                        <Visibility />
                                                    ) : (
                                                        <VisibilityOff />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    error={
                                        touched.new_password2 &&
                                        Boolean(errors.new_password2)
                                    }
                                    helperText={
                                        errors.new_password2 &&
                                        touched.new_password2
                                            ? errors.new_password2
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
                                    Change Password
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}
        </Container>
    );
};

export default PasswordChange;
