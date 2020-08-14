// tslint:disable: jsx-no-lambda
// tslint:disable: react-this-binding-issue
// tslint:disable: use-simple-attributes

import {
    Avatar,
    Button,
    Checkbox,
    CircularProgress,
    Container,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
    CheckBox as CheckBoxIcon,
    CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
    LockOutlined as LockOutlinedIcon,
} from "@material-ui/icons";
import clsx from "clsx";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { user as userActions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import { IProfileEditFormValues } from "../../store/types";
import { tShirtSizes } from "../../types";

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
        marginTop: theme.spacing(3),
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
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    subtitle: { color: "grey" },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

const ProfileEditPage: React.FC = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();
    const [_userProfile, loading, error] = StateHooks.useUserInfo();
    const handleFormSubmit = (values: IProfileEditFormValues) => {
        values.age = values.age === "" ? null : values.age;
        dispatch(userActions.updateUserProfile(values));
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

    useEffect(() => {
        dispatch(userActions.getUserProfile());
    }, [dispatch]);

    const userProfile = StateHooks.useUserProfile();

    const SelectChoices = () => {
        return tShirtSizes.map((element, idx, arr) => {
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
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Edit Profile
                </Typography>
                <Typography variant="subtitle2" className={classes.subtitle}>
                    Fill out all relevant details in order to be considered for
                    volunteer positions
                </Typography>
                {errorMessage}
                {loading ? (
                    <CircularProgress />
                ) : (
                    <Formik
                        initialValues={{
                            first_name: userProfile.first_name || "",
                            last_name: userProfile.last_name || "",
                            username: userProfile.username || "",
                            email: userProfile.email || "",
                            over_eighteen: userProfile.over_eighteen || false,
                            age: userProfile.age || null,
                            previous_volunteer:
                                userProfile.previous_volunteer || false,
                            dietary_restrictions:
                                userProfile.dietary_restrictions || "",
                            medical_restrictions:
                                userProfile.medical_restrictions || "",
                            special_interests:
                                userProfile.special_interests || "",
                            student_volunteer_hours:
                                userProfile.student_volunteer_hours || false,
                            emergency_contact:
                                userProfile.emergency_contact || "",
                            comments: userProfile.comments || "",
                            t_shirt_size: userProfile.t_shirt_size || "M",
                        }}
                        validationSchema={Yup.object({
                            first_name: Yup.string().required("Required."),
                            last_name: Yup.string().required("Required."),
                            username: Yup.string().required("Required."),
                            email: Yup.string()
                                .email("Invalid email address")
                                .required("Required."),
                            over_eighteen: Yup.boolean(),
                            age: Yup.number()
                                .min(1)
                                .integer()
                                .nullable()
                                .when("over_eighteen", {
                                    is: false,
                                    then: Yup.number()
                                        .min(1)
                                        .integer()
                                        .nullable()
                                        .required("Required."),
                                }),
                            previous_volunteer: Yup.boolean(),
                            dietary_restrictions: Yup.string(),
                            medical_restrictions: Yup.string(),
                            special_interests: Yup.string(),
                            student_volunteer_hours: Yup.boolean(),
                            emergency_contact: Yup.string(),
                            comments: Yup.string(),
                            t_shirt_size: Yup.string().oneOf(tShirtSizes),
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
                                            name="first_name"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="firstName"
                                            label="First Name"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            helperText={
                                                errors.first_name &&
                                                touched.first_name
                                                    ? errors.first_name
                                                    : ""
                                            }
                                            error={
                                                touched.first_name &&
                                                Boolean(errors.first_name)
                                            }
                                            value={values.first_name}
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
                                            id="last_name"
                                            label="Last Name"
                                            name="last_name"
                                            autoComplete="lname"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            helperText={
                                                errors.last_name &&
                                                touched.last_name
                                                    ? errors.last_name
                                                    : ""
                                            }
                                            error={
                                                touched.last_name &&
                                                Boolean(errors.last_name)
                                            }
                                            value={values.last_name}
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
                                                errors.email && touched.email
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
                                    <Grid
                                        item
                                        container
                                        xs={12}
                                        sm={values.over_eighteen ? 12 : 6}
                                        justify="center"
                                        alignItems="center"
                                    >
                                        <FormControlLabel
                                            className={classes.textField}
                                            control={
                                                <Checkbox
                                                    className={classes.checkbox}
                                                    icon={
                                                        <CheckBoxOutlineBlankIcon
                                                            fontSize="small"
                                                            color="primary"
                                                        />
                                                    }
                                                    checkedIcon={
                                                        <CheckBoxIcon fontSize="small" />
                                                    }
                                                    checked={
                                                        values.over_eighteen
                                                    }
                                                    onChange={handleChange}
                                                    name="over_eighteen"
                                                />
                                            }
                                            label="18+?"
                                        />
                                    </Grid>
                                    {!values.over_eighteen ? (
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                id="age"
                                                name="age"
                                                label="Age"
                                                type="number"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                fullWidth
                                                className={classes.textField}
                                                color="primary"
                                                variant="outlined"
                                                margin="normal"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.age}
                                                helperText={
                                                    errors.age && touched.age
                                                        ? errors.age
                                                        : ""
                                                }
                                                error={
                                                    touched.age &&
                                                    Boolean(errors.age)
                                                }
                                            />
                                        </Grid>
                                    ) : null}

                                    <Grid item xs={12}>
                                        <TextField
                                            id="dietary_restrictions"
                                            className={classes.textField}
                                            color="primary"
                                            variant="outlined"
                                            margin="normal"
                                            name="dietary_restrictions"
                                            label="Dietary Restrictions"
                                            fullWidth
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.dietary_restrictions}
                                            helperText={
                                                errors.dietary_restrictions &&
                                                touched.dietary_restrictions
                                                    ? errors.dietary_restrictions
                                                    : ""
                                            }
                                            error={
                                                touched.dietary_restrictions &&
                                                Boolean(
                                                    errors.dietary_restrictions
                                                )
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="medical_restrictions"
                                            className={classes.textField}
                                            color="primary"
                                            variant="outlined"
                                            margin="normal"
                                            name="medical_restrictions"
                                            label="Medical Restrictions"
                                            fullWidth
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.medical_restrictions}
                                            helperText={
                                                errors.medical_restrictions &&
                                                touched.medical_restrictions
                                                    ? errors.medical_restrictions
                                                    : ""
                                            }
                                            error={
                                                touched.medical_restrictions &&
                                                Boolean(
                                                    errors.medical_restrictions
                                                )
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="special_interests"
                                            className={classes.textField}
                                            color="primary"
                                            variant="outlined"
                                            margin="normal"
                                            name="special_interests"
                                            label="Special Interests"
                                            fullWidth
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.special_interests}
                                            helperText={
                                                errors.special_interests &&
                                                touched.special_interests
                                                    ? errors.special_interests
                                                    : ""
                                            }
                                            error={
                                                touched.special_interests &&
                                                Boolean(
                                                    errors.special_interests
                                                )
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="emergency_contact"
                                            className={classes.textField}
                                            color="primary"
                                            variant="outlined"
                                            margin="normal"
                                            name="emergency_contact"
                                            label="Emergency Contact"
                                            fullWidth
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.emergency_contact}
                                            helperText={
                                                errors.emergency_contact &&
                                                touched.emergency_contact
                                                    ? errors.emergency_contact
                                                    : ""
                                            }
                                            error={
                                                touched.emergency_contact &&
                                                Boolean(
                                                    errors.emergency_contact
                                                )
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="comments"
                                            className={classes.textField}
                                            color="primary"
                                            variant="outlined"
                                            margin="normal"
                                            name="comments"
                                            label="Comments"
                                            fullWidth
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.comments}
                                            helperText={
                                                errors.comments &&
                                                touched.comments
                                                    ? errors.comments
                                                    : ""
                                            }
                                            error={
                                                touched.comments &&
                                                Boolean(errors.comments)
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControlLabel
                                            className={classes.checkbox}
                                            control={
                                                <Checkbox
                                                    className={classes.checkbox}
                                                    icon={
                                                        <CheckBoxOutlineBlankIcon
                                                            fontSize="small"
                                                            color="primary"
                                                        />
                                                    }
                                                    checkedIcon={
                                                        <CheckBoxIcon fontSize="small" />
                                                    }
                                                    checked={
                                                        values.previous_volunteer
                                                    }
                                                    onChange={handleChange}
                                                    name="previous_volunteer"
                                                />
                                            }
                                            label="Previous Volunteer"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControlLabel
                                            className={classes.textField}
                                            control={
                                                <Checkbox
                                                    className={classes.checkbox}
                                                    icon={
                                                        <CheckBoxOutlineBlankIcon
                                                            fontSize="small"
                                                            color="primary"
                                                        />
                                                    }
                                                    checkedIcon={
                                                        <CheckBoxIcon fontSize="small" />
                                                    }
                                                    checked={
                                                        values.student_volunteer_hours
                                                    }
                                                    onChange={handleChange}
                                                    name="student_volunteer_hours"
                                                />
                                            }
                                            label="Student Volunteer Hours"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl
                                            variant="outlined"
                                            className={clsx(
                                                classes.formControl,
                                                classes.textField
                                            )}
                                        >
                                            <InputLabel>
                                                T-Shirt Size
                                            </InputLabel>
                                            <Select
                                                value={values.t_shirt_size}
                                                onChange={handleChange}
                                                label="T-Shirt Size"
                                                name="t_shirt_size"
                                                fullWidth
                                            >
                                                {SelectChoices()}
                                            </Select>
                                        </FormControl>
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
                                    Save Profile
                                </Button>
                            </Form>
                        )}
                    </Formik>
                )}
            </div>
        </Container>
    );
};

export default ProfileEditPage;
