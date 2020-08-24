// tslint:disable: jsx-no-lambda
// tslint:disable: react-this-binding-issue
// tslint:disable: use-simple-attributes

import {
    Avatar,
    Button,
    CircularProgress,
    Container,
    TextField,
    Typography,
} from "@material-ui/core";
// tslint:disable-next-line: no-submodule-imports
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { LockOpen as LockOpenIcon } from "@material-ui/icons";
import { Form, Formik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { auth } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import { buildErrorMessage } from "../../store/utils";

interface IResetPasswordFormValues {
    email: string;
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
    const [loading, isAuthenticated, error] = StateHooks.useAuthInfo();

    const errorMessage: any[] = buildErrorMessage(error);

    const handleFormSubmit = (values: IResetPasswordFormValues) => {
        const email = values.email;

        dispatch(auth.resetPassword(email));
    };

    return (
        <Container component="main" maxWidth="xs">
            {errorMessage}
            {loading ? (
                <CircularProgress />
            ) : (
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOpenIcon />
                    </Avatar>
                    <Typography component="h1" variant="h4">
                        Reset Your Password
                    </Typography>

                    <Formik
                        initialValues={{
                            email: "",
                        }}
                        validationSchema={Yup.object({
                            email: Yup.string()
                                .email("Invalid email address")
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
                                    color="primary"
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    type="email"
                                    label="Please enter your Email Address"
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
                                        touched.email && Boolean(errors.email)
                                    }
                                    value={values.email}
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
