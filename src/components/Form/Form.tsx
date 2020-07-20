// tslint:disable: jsx-no-lambda
// tslint:disable: react-this-binding-issue
// tslint:disable: use-simple-attributes

import DateFnsUtils from "@date-io/date-fns";
import { Box, Button, Container, Grid, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
    KeyboardDateTimePicker,
    MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import axios from "axios";
import { Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import { StateHooks } from "../../store/hooks";
import * as Yup from "yup";
import Copyright from "../Copyright";

interface IFormValues {
    title: string;
    description: string;
    startTime: Date | null;
    endTime: Date | null;
    numberOfSlots: number;
}

type RequestType = "PUT" | "POST";

interface ICustomFormProps {
    requestTypeProp: RequestType;
    eventIdProp?: number;
    buttonText: string;
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const CustomForm: React.FC<ICustomFormProps> = ({
    requestTypeProp,
    eventIdProp,
    buttonText,
}) => {
    const classes = useStyles();
    const token = StateHooks.useToken();

    const handleFormSubmit = (
        values: IFormValues,
        requestType: RequestType,
        eventID: number | undefined
    ) => {
        console.log(values.title);
        const title = values.title;
        const description = values.description;
        const startTime = values.startTime;
        const endTime = values.endTime;
        const numberOfSlots = values.numberOfSlots;

        console.log(title, description, startTime, endTime, numberOfSlots);
        axios.defaults.headers = {
            Authorization: token,
            "Content-Type": "application/json",
        };
        if (token && process.env["REACT_APP_API_URI"] !== undefined) {
            switch (requestType) {
                case "POST":
                    axios
                        .post(process.env["REACT_APP_API_URI"], {
                            title,
                            description,
                            start_time: startTime,
                            end_time: endTime,
                            number_of_slots: numberOfSlots,
                        })
                        .then((res) => console.log(res))
                        .catch((err) => console.error(err));
                    break;
                case "PUT":
                    axios
                        .put(`${process.env["REACT_APP_API_URI"]}${eventID}/`, {
                            title,
                            description,
                            start_time: startTime,
                            end_time: endTime,
                            number_of_slots: numberOfSlots,
                        })
                        .then((res) => console.log(res))
                        .catch((err) => console.error(err));
                    break;
            }
        }
    };

    const history = useHistory();

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Formik
                    initialValues={{
                        title: "",
                        description: "",
                        startTime: new Date(),
                        endTime: new Date(),
                        numberOfSlots: 0,
                    }}
                    validationSchema={Yup.object({
                        title: Yup.string().required("Required"),
                        description: Yup.string().required("Required"),
                        startTime: Yup.date().required("Required"),
                        endTime: Yup.date().required("Required"),
                        numberOfSlots: Yup.number()
                            .min(1, "Must be a positive number")
                            .required("Required"),
                    })}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        setTimeout(() => {
                            // alert(JSON.stringify(values, null, 2));
                            handleFormSubmit(
                                values,
                                requestTypeProp,
                                eventIdProp
                            );
                            setSubmitting(false);
                            history.go(0);
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
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="title"
                                label="Event Title"
                                name="title"
                                autoComplete="title"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.title}
                                helperText={
                                    errors.title && touched.title
                                        ? errors.title
                                        : ""
                                }
                                error={touched.title && Boolean(errors.title)}
                                autoFocus
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="description"
                                label="Description"
                                type="description"
                                id="description"
                                autoComplete="description"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.description}
                                helperText={
                                    errors.description && touched.description
                                        ? errors.description
                                        : ""
                                }
                                error={
                                    touched.description &&
                                    Boolean(errors.description)
                                }
                            />
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid container justify="space-around">
                                    <KeyboardDateTimePicker
                                        disableToolbar
                                        variant="inline"
                                        format="MM/dd/yyyy HH:mm"
                                        margin="normal"
                                        name="startTime"
                                        id="start-time"
                                        label="Start time picker"
                                        onChange={(value) => {
                                            console.log(
                                                "setting value to",
                                                value
                                            );
                                            setFieldValue("startTime", value);
                                        }}
                                        onBlur={handleBlur}
                                        value={values.startTime}
                                        KeyboardButtonProps={{
                                            "aria-label": "change date",
                                        }}
                                        helperText={
                                            errors.startTime &&
                                            touched.startTime
                                                ? errors.startTime
                                                : ""
                                        }
                                        error={
                                            touched.startTime &&
                                            Boolean(errors.startTime)
                                        }
                                    />
                                    <KeyboardDateTimePicker
                                        disableToolbar
                                        variant="inline"
                                        format="MM/dd/yyyy HH:mm"
                                        margin="normal"
                                        name="endTime"
                                        id="end-time"
                                        label="End time picker"
                                        onChange={(value) => {
                                            console.log(
                                                "setting value to",
                                                value
                                            );
                                            setFieldValue("endTime", value);
                                        }}
                                        onBlur={handleBlur}
                                        value={values.endTime}
                                        KeyboardButtonProps={{
                                            "aria-label": "change date",
                                        }}
                                        helperText={
                                            errors.endTime && touched.endTime
                                                ? errors.endTime
                                                : ""
                                        }
                                        error={
                                            touched.endTime &&
                                            Boolean(errors.endTime)
                                        }
                                    />
                                </Grid>
                            </MuiPickersUtilsProvider>
                            <TextField
                                id="standard-number"
                                name="numberOfSlots"
                                label="Number"
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.numberOfSlots}
                                helperText={
                                    errors.numberOfSlots &&
                                    touched.numberOfSlots
                                        ? errors.numberOfSlots
                                        : ""
                                }
                                error={
                                    touched.numberOfSlots &&
                                    Boolean(errors.numberOfSlots)
                                }
                            />
                            <Button
                                type="submit"
                                disabled={isSubmitting || !isValid || !token}
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                {buttonText}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
};

export default CustomForm;
