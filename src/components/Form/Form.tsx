// tslint:disable: jsx-no-lambda
// tslint:disable: react-this-binding-issue
// tslint:disable: use-simple-attributes

import {
    Button,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import clsx from "clsx";
import { Form, Formik } from "formik";
import React from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { VolunteerUrls } from "../../constants";
import { logDev, notifyApiError, setAuthHeaders } from "../../store/actions/apiUtils";
import { StateHooks } from "../../store/hooks";

interface IFormValues {
    category: string;
    title: string;
    description: string;
    startTime: Date | null;
    endTime: Date | null;
}

type RequestType = "PUT" | "POST";

interface ICustomFormProps {
    requestTypeProp: RequestType;
    eventIdProp?: number;
    buttonText: string;
}

const useStyles = makeStyles()((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
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

const CustomForm: React.FC<ICustomFormProps> = ({
    requestTypeProp,
    eventIdProp,
    buttonText,
}) => {
    const theme = useTheme();
    const { classes } = useStyles();
    const token = StateHooks.useToken();
    const navigate = useNavigate();
    const [cookies, _setCookie] = useCookies(["csrftoken"]);
    const volunteerCategories = StateHooks.useVolunteerCategoryTypes();
    const volunteerCategoryTypes = volunteerCategories.map((categoryType) => {
        return categoryType.tag;
    });
    const getVolunteerCategory = (title: string) => {
        return volunteerCategories.find((category) => category.tag === title);
    };

    const handleFormSubmit = (
        values: IFormValues,
        requestType: RequestType,
        positionID: number | undefined
    ) => {
        const category = getVolunteerCategory(values.category);
        const title = values.title;
        const description = values.description;
        const startTime = values.startTime;
        const endTime = values.endTime;

        setAuthHeaders(token, cookies.csrftoken);
        if (token) {
            switch (requestType) {
                case "POST":
                    axios
                        .post(VolunteerUrls.CATEGORY_LIST, {
                            title,
                            category_type: category,
                            description,
                            start_time: startTime,
                            end_time: endTime,
                        })
                        .then(() => {
                            navigate("/volunteer/calendar");
                        })
                        .catch((err) =>
                            notifyApiError(err, "Could not create position.")
                        );
                    break;
                case "PUT":
                    if (positionID) {
                        axios
                            .put(VolunteerUrls.CATEGORY_DETAILS(positionID), {
                                title,
                                category_type: category,
                                description,
                                start_time: startTime,
                                end_time: endTime,
                            })
                            .then(() => {
                                navigate("/volunteer/calendar");
                            })
                            .catch((err) =>
                                notifyApiError(
                                    err,
                                    "Could not update position."
                                )
                            );
                    } else {
                        logDev("cannot update without `positionID`");
                    }
                    break;
            }
        }
    };

    const SelectChoices = () => {
        return volunteerCategoryTypes.map((element, idx, arr) => {
            return (
                <MenuItem key={idx} value={element}>
                    {element}
                </MenuItem>
            );
        });
    };

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Formik
                    initialValues={{
                        category: "",
                        title: "",
                        description: "",
                        startTime: new Date(),
                        endTime: new Date(),
                    }}
                    validationSchema={Yup.object({
                        category: Yup.string().oneOf(volunteerCategoryTypes),
                        title: Yup.string().required("Required"),
                        description: Yup.string().required("Required"),
                        startTime: Yup.date().required("Required"),
                        endTime: Yup.date().required("Required"),
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
                            <FormControl
                                className={clsx(
                                    classes.formControl,
                                    classes.textField
                                )}
                            >
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={values.category}
                                    onChange={handleChange}
                                    label="Position Category"
                                    name="category"
                                    fullWidth
                                >
                                    {SelectChoices()}
                                </Select>
                            </FormControl>
                            <TextField
                                variant="filled"
                                margin="normal"
                                required
                                fullWidth
                                id="title"
                                label="Position Title"
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
                                variant="filled"
                                margin="normal"
                                required
                                fullWidth
                                name="description"
                                label="Position Description"
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
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Grid container justifyContent="space-around">
                                    <DateTimePicker
                                        format="MM/dd/yyyy hh:mm a"
                                        name="startTime"
                                        label="Start time picker"
                                        onChange={(value) => {
                                            setFieldValue("startTime", value);
                                        }}
                                        value={values.startTime}
                                        slotProps={{
                                            textField: {
                                                id: "start-time",
                                                margin: "normal",
                                                onBlur: handleBlur,
                                                helperText:
                                                    typeof errors.startTime ===
                                                        "string" &&
                                                    touched.startTime
                                                        ? errors.startTime
                                                        : "",
                                                error:
                                                    touched.startTime &&
                                                    Boolean(errors.startTime),
                                            },
                                        }}
                                    />
                                    <DateTimePicker
                                        format="MM/dd/yyyy hh:mm a"
                                        name="endTime"
                                        label="End time picker"
                                        onChange={(value) => {
                                            setFieldValue("endTime", value);
                                        }}
                                        value={values.endTime}
                                        slotProps={{
                                            textField: {
                                                id: "end-time",
                                                margin: "normal",
                                                onBlur: handleBlur,
                                                helperText:
                                                    typeof errors.endTime ===
                                                        "string" &&
                                                    touched.endTime
                                                        ? errors.endTime
                                                        : "",
                                                error:
                                                    touched.endTime &&
                                                    Boolean(errors.endTime),
                                            },
                                        }}
                                    />
                                </Grid>
                            </LocalizationProvider>
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
        </Container>
    );
};

export default CustomForm;
