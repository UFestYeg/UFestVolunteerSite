import {
    Button,
    Chip,
    Container,
    GlobalStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import { makeStyles } from "tss-react/mui";
import moment from "moment";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { StateHooks } from "../../store/hooks";
import { user as userActions } from "../../store/actions";
import { IUserProfile, IUserRequest } from "../../store/types";
import { Loading } from "../Loading";

const useStyles = makeStyles()((theme) => ({
    container: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(5),
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: theme.spacing(2),
    },
    title: {
        fontWeight: 600,
        marginBottom: theme.spacing(0.5),
    },
    subtitle: {
        color: theme.palette.text.secondary,
        marginBottom: theme.spacing(3),
    },
    button: {
        // fontSize uses !important because the theme's typography.button (1.3rem)
        // is injected after this tss-react class and would otherwise win.
        fontSize: "0.7rem !important",
        paddingBlock: theme.spacing(0.85),
        paddingInline: theme.spacing(2.25),
        borderRadius: 999,
        whiteSpace: "nowrap",
        boxShadow: "none",
        "&:hover": {
            boxShadow: "none",
        },
        "@media print": {
            display: "none",
        },
    },
    tableCard: {
        borderRadius: theme.spacing(2),
        overflow: "hidden",
        border: `1px solid ${theme.palette.divider}`,
        boxShadow:
            "0 1px 2px rgba(16, 24, 40, 0.06), 0 1px 3px rgba(16, 24, 40, 0.10)",
    },
    table: {
        minWidth: 650,
    },
    headRow: {
        backgroundColor: "#f7f9fb",
    },
    headCell: {
        fontWeight: 700,
        fontSize: "0.72rem",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: theme.palette.text.secondary,
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    bodyRow: {
        transition: "background-color 0.15s ease",
        "&:nth-of-type(even)": {
            backgroundColor: "#fbfcfe",
        },
        "&:hover": {
            backgroundColor: "#eef6fb",
        },
        "& td": {
            borderBottom: `1px solid ${theme.palette.divider}`,
        },
        "&:last-of-type td": {
            borderBottom: 0,
        },
    },
    activityCell: {
        fontWeight: 600,
        fontSize: "0.95rem",
    },
    roleCell: {
        color: theme.palette.text.secondary,
    },
    datePrimary: {
        fontSize: "0.9rem",
        whiteSpace: "nowrap",
    },
    dateSecondary: {
        display: "block",
        fontSize: "0.78rem",
        color: theme.palette.text.secondary,
        whiteSpace: "nowrap",
    },
    statusChip: {
        fontWeight: 600,
        fontSize: "0.68rem",
        letterSpacing: "0.04em",
        height: 24,
        borderRadius: 999,
    },
    statusAccepted: {
        backgroundColor: "#e6f4ea",
        color: "#1e7e34",
    },
    statusPending: {
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.secondary.contrastText,
    },
    emptyCell: {
        color: theme.palette.text.secondary,
        paddingTop: theme.spacing(5),
        paddingBottom: theme.spacing(5),
    },
    printSection: {
        "@media print": {
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            margin: 0,
            padding: "20px",
            backgroundColor: "white",
            // Re-show only the summary subtree after hiding everything else.
            visibility: "visible",
            "& *": {
                visibility: "visible",
            },
        },
    },
}));

// Hide the rest of the app when printing so only the summary subtree
// (re-shown via the printSection class) ends up in the print/PDF output.
const printGlobalStyles = (
    <GlobalStyles
        styles={{
            "@media print": {
                "body *": { visibility: "hidden" },
            },
        }}
    />
);

const VolunteerScheduleSummary: React.FC = () => {
    const { classes, cx } = useStyles();
    const dispatch = StateHooks.useAppDispatch();
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

    const acceptedCount = acceptedRequests.filter(
        (r: IUserRequest) => r.status === "ACCEPTED"
    ).length;
    const pendingCount = acceptedRequests.length - acceptedCount;
    const shiftLabel = `${acceptedRequests.length} ${
        acceptedRequests.length === 1 ? "shift" : "shifts"
    }`;

    return (
        <Container className={cx(classes.container, classes.printSection)}>
            {printGlobalStyles}
            <div className={classes.header}>
                <div>
                    <Typography variant="h4" className={classes.title}>
                        Volunteer Schedule Summary
                    </Typography>
                    <Typography variant="body2" className={classes.subtitle}>
                        {userProfile.first_name} {userProfile.last_name}
                        {acceptedRequests.length > 0
                            ? ` \u2022 ${shiftLabel} \u2022 ${acceptedCount} accepted, ${pendingCount} pending`
                            : ""}
                    </Typography>
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePrint}
                    className={classes.button}
                    startIcon={<PrintOutlinedIcon />}
                >
                    Print / Save as PDF
                </Button>
            </div>

            <TableContainer component={Paper} className={classes.tableCard}>
                <Table className={classes.table} aria-label="schedule table">
                    <TableHead>
                        <TableRow className={classes.headRow}>
                            <TableCell className={classes.headCell}>
                                Activity
                            </TableCell>
                            <TableCell className={classes.headCell}>
                                Role
                            </TableCell>
                            <TableCell className={classes.headCell}>
                                Start Time
                            </TableCell>
                            <TableCell className={classes.headCell}>
                                End Time
                            </TableCell>
                            <TableCell className={classes.headCell}>
                                Status
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {acceptedRequests.length > 0 ? (
                            acceptedRequests.map((req: IUserRequest) => (
                                <TableRow
                                    key={req.id}
                                    className={classes.bodyRow}
                                >
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        className={classes.activityCell}
                                    >
                                        {req.role.category.title}
                                    </TableCell>
                                    <TableCell className={classes.roleCell}>
                                        {req.role.title}
                                    </TableCell>
                                    <TableCell>
                                        <span className={classes.datePrimary}>
                                            {moment(
                                                req.role.category.start_time
                                            ).format("ddd, MMM D, YYYY")}
                                        </span>
                                        <span className={classes.dateSecondary}>
                                            {moment(
                                                req.role.category.start_time
                                            ).format("h:mm A")}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={classes.datePrimary}>
                                            {moment(
                                                req.role.category.end_time
                                            ).format("ddd, MMM D, YYYY")}
                                        </span>
                                        <span className={classes.dateSecondary}>
                                            {moment(
                                                req.role.category.end_time
                                            ).format("h:mm A")}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={req.status}
                                            size="small"
                                            className={cx(
                                                classes.statusChip,
                                                req.status === "ACCEPTED"
                                                    ? classes.statusAccepted
                                                    : classes.statusPending
                                            )}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    align="center"
                                    className={classes.emptyCell}
                                >
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
