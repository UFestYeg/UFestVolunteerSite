import {
    Button,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { user as userActions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import { IUserProfile, IUserRequest } from "../../store/types";
import { Loading } from "../Loading";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        marginTop: theme.spacing(3),
        overflowX: "auto",
        marginBottom: theme.spacing(2),
        border: "2px solid #000000",
    },
    table: {
        minWidth: 650,
    },
    button: {
        margin: theme.spacing(2),
        "@media print": {
            display: "none",
        },
    },
    printSection: {
        "@media print": {
            visibility: "visible",
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            margin: 0,
            padding: "20px",
            backgroundColor: "white",
        },
    },
}));

const VolunteerScheduleSummary: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [cookies] = useCookies(["csrftoken"]);

    useEffect(() => {
        dispatch(userActions.getUserProfile(cookies.csrftoken));
    }, [dispatch, cookies.csrftoken]);

    const [
        userProfileUnsafe,
        loadingUnsafe,
    ] = StateHooks.useUserInfo();
    const userProfile = userProfileUnsafe as IUserProfile;
    const loading = loadingUnsafe as boolean;

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <Loading />;
    }

    const requests = userProfile.requests || [];
    // Filter for accepted requests only? Or all? User said "volunteering activities", usually implies confirmed ones.
    // I'll stick to ACCEPTED to be safe as a "schedule summary".
    const acceptedRequests = requests.filter(
        (r: IUserRequest) => r.status === "ACCEPTED" || r.status === "PENDING"
    );

    // Sort by start time
    acceptedRequests.sort((a: IUserRequest, b: IUserRequest) => {
        return (
            new Date(a.role.category.start_time).getTime() -
            new Date(b.role.category.start_time).getTime()
        );
    });

    return (
        <Container className={classes.printSection}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Volunteer Schedule Summary
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePrint}
                    className={classes.button}
                >
                    Download as PDF
                </Button>
            </div>

            <Typography variant="h6" gutterBottom>
                Volunteer: {userProfile.first_name} {userProfile.last_name}
            </Typography>

            <TableContainer component={Paper} className={classes.root}>
                <Table className={classes.table} aria-label="schedule table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Activity</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Start Time</TableCell>
                            <TableCell>End Time</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {acceptedRequests.length > 0 ? (
                            acceptedRequests.map((req: IUserRequest) => (
                                <TableRow key={req.id}>
                                    <TableCell component="th" scope="row">
                                        {req.role.category.title}
                                    </TableCell>
                                    <TableCell>{req.role.title}</TableCell>
                                    <TableCell>
                                        {moment(req.role.category.start_time).format(
                                            "MMM D, YYYY h:mm A"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {moment(req.role.category.end_time).format(
                                            "MMM D, YYYY h:mm A"
                                        )}
                                    </TableCell>
                                    <TableCell>{req.status}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No scheduled activities found for the selected
                                    dates.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default VolunteerScheduleSummary;