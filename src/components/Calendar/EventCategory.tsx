import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Popover,
    Select,
    SelectChangeEvent,
    Typography,
} from "@mui/material";
// tslint:disable-next-line: no-submodule-imports
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import {
    CancelPresentation,
    CheckBox,
    Close,
    SwapVert,
} from "@mui/icons-material";
import moment from "moment";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { StateHooks } from "../../store/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { volunteer as volunteerActions } from "../../store/actions";
import { Loading } from "../Loading";
import { useHoverShiftLeft } from "./eventHover";

export type EventCategoryType = {
    resourceId: number;
    title: string;
    start_time: string | Date;
    end_time: string | Date;
    allDay?: boolean;
    resource?: any;
    description?: string;
    roles?: any;
    number_of_positions: number | null;
    number_of_open_positions: number | null;
    category: string;
    requests?: any[];
    roleID: number;
    eventID: number;
};

export const defaultEventCategory = {
    resourceId: -1,
    title: "",
    start_time: "",
    end_time: "",
    allDay: false,
    resource: "",
    description: "",
    roles: [],
    number_of_positions: -1,
    number_of_open_positions: -1,
    category: "",
    requests: [],
    roleID: -1,
    eventID: -1,
};

interface IRoleSelectProps {
    options: any[];
    roleID: number | string;
    setRoleId: React.Dispatch<React.SetStateAction<string | number>>;
}

interface IRenderRowProps {
    data: any[];
    index: number;
    request: any;
}

interface IEventCategory {
    event: any;
    selectedCategories: string[];
    defaultDate: Date | null;
}

const useStyles = makeStyles()((theme) =>
    ({
        card: {
            borderRadius: 16,
            boxShadow: "0 12px 40px rgba(34, 35, 58, 0.18)",
            overflow: "hidden",
            minWidth: 320,
            maxWidth: 400,
            color: theme.palette.text.primary,
        },
        cardContent: {
            padding: theme.spacing(0.5, 1),
            "&:last-child": {
                paddingBottom: theme.spacing(1),
            },
        },
        cardHeader: {
            backgroundColor: theme.palette.primary.dark,
            color: theme.palette.primary.contrastText,
            padding: theme.spacing(1.25, 2),
            "& .MuiCardHeader-title": {
                fontSize: "1.25rem",
                fontWeight: 600,
            },
            "& .MuiCardHeader-subheader": {
                color: theme.palette.primary.contrastText,
                opacity: 0.8,
                fontSize: "0.9rem",
            },
            "& .MuiCardHeader-action": {
                margin: 0,
                alignSelf: "center",
            },
        },
        closeButton: {
            color: theme.palette.primary.contrastText,
            opacity: 0.85,
            "&:hover": {
                opacity: 1,
                backgroundColor: "rgba(255, 255, 255, 0.12)",
            },
        },
        container: {
            display: "flex",
            flexWrap: "wrap",
        },
        eventRoot: {
            // Fill the full react-big-calendar event box so the entire card is
            // clickable. The Container otherwise only takes its intrinsic text
            // height, so clicks below the text hit the event box but missed
            // this onClick handler (no popover). Also fills the expanded card.
            height: "100%",
            // Drop MUI Container's default 24px side gutters (see the
            // `disableGutters`/`maxWidth={false}` props on the Container below).
            // In a narrow event tile those gutters left almost no room for
            // text, so words wrapped mid-word and spilled out of the block.
            // A small even padding plus `overflowWrap` keeps the title inside
            // the card and uses the tile's full width. Kept identical to the
            // volunteer EventDetail tile so both calendars behave the same.
            padding: theme.spacing(0.25, 0.75),
            overflowWrap: "break-word",
        },
        accept: {
            color: "green",
        },
        deny: { color: "red" },
        typography: {
            padding: theme.spacing(2),
        },
        formControl: {
            margin: theme.spacing(1),
            maxWidth: "100%",
            minWidth: 150,
        },
        noPadding: {
            paddingBottom: 0,
            paddingTop: 0,
            display: "flex",
            flexWrap: "wrap",
        },
        list: {
            width: "100%",
            backgroundColor: theme.palette.background.paper,
            position: "relative",
            overflow: "auto",
            maxHeight: 320,
            padding: 0,
        },
        menuItem: {
            display: "flex",
            flexWrap: "wrap",
        },
    })
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const RoleSelect: React.FC<IRoleSelectProps> = ({
    options,
    roleID,
    setRoleId,
}) => {
    const theme = useTheme();
    const { classes } = useStyles();
    const handleChange = (event: SelectChangeEvent<string | number>) => {
        setRoleId(Number(event.target.value) || "");
    };

    return (
        <>
            {options && options.length > 0 ? (
                <FormControl
                    variant="outlined"
                    color="primary"
                    className={classes.formControl}
                >
                    <Select
                        labelId="role-select-label"
                        id="role-select"
                        className={classes.noPadding}
                        displayEmpty
                        fullWidth
                        value={roleID}
                        onChange={handleChange}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight:
                                        ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                                },
                            },
                            variant: "menu",
                        }}
                    >
                        <MenuItem disabled value="">
                            <em>Available Roles</em>
                        </MenuItem>
                        {options.map((option: any) => (
                            <MenuItem
                                className={classes.menuItem}
                                key={option.roleID}
                                value={option.roleID}
                            >
                                <ListItemText
                                    primary={`${option.category}: ${
                                        option.title
                                    } (${moment(
                                        option.start_time.getTime()
                                    ).format("DD-MM-YYYY hh:mm a")} - ${moment(
                                        option.end_time.getTime()
                                    ).format("DD-MM-YYYY hh:mm a")})`}
                                />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ) : null}
        </>
    );
};

const EventCategory = ({
    event,
    selectedCategories,
    defaultDate,
}: IEventCategory) => {
    const navigate = useNavigate();
    const { pathname: url } = useLocation();
    const theme = useTheme();
    const { classes } = useStyles();
    const dispatch = StateHooks.useAppDispatch();
    const containerRef = useHoverShiftLeft<HTMLDivElement>();
    const [_categories, loading, _error] = StateHooks.useVolunteerInfo();
    const [cookies, _setCookie] = useCookies(["csrftoken"]);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
    const [roleID, setRoleId] = useState<number | string>("");
    const [submitRequest, setSubmitRequest] = useState<any>();
    const mappedRoles = StateHooks.useMappedRoles();
    const { requests } = event;

    const browserState = {
        oldCategoryView: true,
        oldDefaultDate: defaultDate,
        oldSelectedCategories: selectedCategories,
    };

    const isPositionFull = () => {
        return event.number_of_open_positions === 0;
    };

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const handleAccept = (request: any) => {
        dispatch(
            volunteerActions.acceptRequest(
                request,
                url,
                browserState,
                cookies.csrftoken
            )
        );
        handleClosePopover();
    };

    const handleDeny = (request: any) => {
        dispatch(
            volunteerActions.denyRequest(
                request,
                url,
                browserState,
                cookies.csrftoken
            )
        );
        handleClosePopover();
    };

    const renderRow = (props: IRenderRowProps) => {
        const { request, data, index } = props;
        const useDivider = index !== data.length - 1;

        const handleClickOpen = () => {
            setSubmitRequest(request);
            setDialogOpen(true);
        };

        const handleCloseDialog = () => {
            setDialogOpen(false);
        };

        const handleAcceptClick = (
            _event: React.MouseEvent<HTMLButtonElement, MouseEvent>
        ) => {
            handleAccept(request);
        };
        const handleDenyClick = (
            _event: React.MouseEvent<HTMLButtonElement, MouseEvent>
        ) => {
            handleDeny(request);
        };

        const handleOkClick = (submitRoleID: number | string) => {
            if (submitRoleID) {
                const submitMappedRole = mappedRoles.find((role: any) => {
                    return role.roleID === submitRoleID;
                });
                if (submitMappedRole) {
                    const submitRole = {
                        id: submitMappedRole.roleID,
                        title: submitMappedRole.title,
                        description: submitMappedRole.description,
                        number_of_positions:
                            submitMappedRole.number_of_positions,
                        category: submitMappedRole.category,
                    };
                    dispatch(
                        volunteerActions.changeRequestRole(
                            submitRequest,
                            submitRole,
                            url,
                            browserState,
                            cookies.csrftoken
                        )
                    );
                }
            }
            handleCloseDialog();
        };

        const handleSubmit = (_event: React.FormEvent<HTMLFormElement>) => {
            handleOkClick(roleID);
        };

        const handleProfileClick = () => {
            navigate(url, { state: browserState, replace: true });
            navigate(`/volunteer/users/${request.user_profile.pk}`);
        };

        return <>
            {request && request.user_profile ? (
                <>
                    <ListItem key={index} divider={useDivider} button>
                        <ListItemText
                            secondary={`Status: ${request.status}`}
                            secondaryTypographyProps={{
                                color: "textSecondary",
                                fontSize: "0.75rem",
                            }}
                        >
                            <Button
                                onClick={handleProfileClick}
                                size="small"
                                color="primary"
                                sx={{
                                    textTransform: "none",
                                    padding: 0,
                                    minWidth: 0,
                                    justifyContent: "flex-start",
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                }}
                            >
                                {`${request.user_profile.first_name} ${request.user_profile.last_name}`}
                            </Button>
                        </ListItemText>

                        <IconButton
                            edge="end"
                            className={classes.accept}
                            aria-label="accept"
                            onMouseDown={handleClickOpen}
                            size="small">
                            <SwapVert />
                        </IconButton>
                        <form>
                            <IconButton
                                edge="end"
                                className={classes.accept}
                                aria-label="accept"
                                onMouseDown={handleAcceptClick}
                                disabled={isPositionFull()}
                                size="small">
                                <CheckBox />
                            </IconButton>
                        </form>
                        <form>
                            <IconButton
                                edge="end"
                                className={classes.deny}
                                aria-label="deny"
                                onMouseDown={handleDenyClick}
                                size="small">
                                <CancelPresentation />
                            </IconButton>
                        </form>
                    </ListItem>
                    <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                        <DialogTitle>Choose a New Position</DialogTitle>
                        <DialogContent>
                            <form
                                id="change-request-role"
                                className={classes.container}
                                onSubmit={handleSubmit}
                            >
                                <RoleSelect
                                    roleID={roleID}
                                    setRoleId={setRoleId}
                                    options={mappedRoles}
                                />
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onMouseDown={handleCloseDialog}
                                color="primary"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                form="change-request-role"
                                color="primary"
                            >
                                Ok
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            ) : null}
        </>;
    };

    const popoverOpen = Boolean(anchorEl);
    const id = popoverOpen ? "simple-popover" : undefined;

    return <>
        <Container
            onClick={handleClick}
            className={classes.eventRoot}
            ref={containerRef}
            disableGutters
            maxWidth={false}
        >
            <strong>{event.title}</strong>
            <br />
            Available Positions:{" "}
            {event.number_of_positions !== null &&
            event.number_of_open_positions !== null
                ? `${event.number_of_open_positions}/${event.number_of_positions}`
                : "N/A"}
        </Container>
        <Popover
            id={id}
            open={popoverOpen}
            anchorEl={anchorEl}
            onClose={handleClosePopover}
            anchorOrigin={{
                horizontal: "center",
                vertical: "top",
            }}
            transformOrigin={{
                horizontal: "center",
                vertical: "bottom",
            }}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 4,
                        overflow: "visible",
                        backgroundColor: "transparent",
                        boxShadow: "none",
                    },
                },
            }}
        >
            <Card className={classes.card}>
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <CardHeader
                            className={classes.cardHeader}
                            action={
                                <IconButton
                                    aria-label="close"
                                    onClick={handleClosePopover}
                                    size="small"
                                    className={classes.closeButton}
                                >
                                    <Close />
                                </IconButton>
                            }
                            title="Requests"
                            subheader={`${event.category}: ${event.title}`}
                        />
                        <CardContent className={classes.cardContent}>
                            {requests && requests.length > 0 ? (
                                <List className={classes.list}>
                                    {requests.map(
                                        (
                                            r: any,
                                            index: number,
                                            arr: any[]
                                        ) =>
                                            renderRow({
                                                request: r,
                                                data: arr,
                                                index,
                                            })
                                    )}
                                </List>
                            ) : (
                                <Typography
                                    color="textSecondary"
                                    align="center"
                                    sx={{ py: 3 }}
                                >
                                    No Requests
                                </Typography>
                            )}
                        </CardContent>
                    </>
                )}
            </Card>
        </Popover>
    </>;
};

export default EventCategory;
