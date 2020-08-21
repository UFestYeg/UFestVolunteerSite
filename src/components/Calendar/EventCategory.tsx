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
    ListItemIcon,
    ListItemText,
    MenuItem,
    Popover,
    Select,
    Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import {
    Cancel,
    CancelPresentation,
    CheckBox,
    FiberManualRecord,
    SwapVert,
} from "@material-ui/icons";
import moment from "moment";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { volunteer as volunteerActions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import { Loading } from "../Loading";

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
    category: "",
    requests: [],
    roleID: -1,
    eventID: -1,
};
interface AutosizerProps {
    height: number;
    width: number;
}

interface IRoleSelectProps {
    options: any[];
    roleID: number | string;
    setRoleId: React.Dispatch<React.SetStateAction<string | number>>;
}

interface IRenderRowProps {
    data: any[];
    index: number;
}

const useStyles = makeStyles((theme) =>
    createStyles({
        card: {
            transition: "0.3s",
            boxShadow: "0px 14px 80px rgba(34, 35, 58, 0.2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            margin: 8,
            color: theme.palette.primary.dark,
            justifyContent: "center",
        },
        cardContent: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
        },
        cardHeader: {
            width: "-webkit-fill-available",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.text.secondary,
        },
        container: {
            display: "flex",
            flexWrap: "wrap",
        },
        eventRoot: {
            height: "inherit",
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
            maxWidth: 360,
            backgroundColor: theme.palette.background.paper,
            position: "relative",
            overflow: "auto",
            maxHeight: 300,
        },
        menuItem: {
            display: "flex",
            flexWrap: "wrap",
        },
    })
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        },
    },
};

const RoleSelect: React.FC<IRoleSelectProps> = ({
    options,
    roleID,
    setRoleId,
}) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
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
                        MenuProps={MenuProps}
                    >
                        <MenuItem disabled value="">
                            <em>Roles</em>
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

const EventCategory = ({ event }: { event: any }) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();
    const [_categories, loading, error] = StateHooks.useVolunteerInfo();
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
    const [roleID, setRoleId] = useState<number | string>("");
    const mappedRoles = StateHooks.useMappedRoles();
    const { requests } = event;

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const handleAccept = (request: any) => {
        dispatch(volunteerActions.acceptRequest(request));
        handleClosePopover();
    };

    const handleDeny = (request: any) => {
        dispatch(volunteerActions.denyRequest(request));
        handleClosePopover();
    };

    const renderRow = (props: IRenderRowProps) => {
        const { data, index } = props;
        const request = data[index];
        const useDivider = index !== data.length - 1;

        const handleClickOpen = () => {
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
                        title: submitMappedRole.title,
                        description: submitMappedRole.description,
                        number_of_positions:
                            submitMappedRole.number_of_positions,
                    };
                    dispatch(
                        volunteerActions.changeRequestRole(request, submitRole)
                    );
                }
            }
            handleCloseDialog();
        };

        return (
            <>
                {request && request.user_profile ? (
                    <>
                        <ListItem key={index} divider={useDivider} button>
                            <ListItemIcon>
                                <FiberManualRecord />
                            </ListItemIcon>
                            <ListItemText
                                primary={`${request.user_profile.first_name} ${request.user_profile.last_name}`}
                                secondary={`Status: ${request.status}`}
                                secondaryTypographyProps={{
                                    color: "textPrimary",
                                }}
                            />

                            <IconButton
                                edge="end"
                                className={classes.accept}
                                aria-label="accept"
                                onMouseDown={handleClickOpen}
                            >
                                <SwapVert />
                            </IconButton>
                            <form>
                                <IconButton
                                    edge="end"
                                    className={classes.accept}
                                    aria-label="accept"
                                    onMouseDown={handleAcceptClick}
                                >
                                    <CheckBox />
                                </IconButton>
                            </form>
                            <form>
                                <IconButton
                                    edge="end"
                                    className={classes.deny}
                                    aria-label="deny"
                                    onMouseDown={handleDenyClick}
                                >
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
                                    onSubmit={() => handleOkClick(roleID)}
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
            </>
        );
    };

    const popoverOpen = Boolean(anchorEl);
    const id = popoverOpen ? "simple-popover" : undefined;

    return (
        <>
            <Container onClick={handleClick} className={classes.eventRoot}>
                <strong>{event.title}</strong>
                <br />
                {event.number_of_positions &&
                    "Available Positions:  " + event.number_of_positions}
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
                                    >
                                        <Cancel />
                                    </IconButton>
                                }
                                title="Requests"
                                subheader={`${event.category}: ${event.title}`}
                            />
                            <CardContent className={classes.cardContent}>
                                <Typography color="error">
                                    {error && error.reponse
                                        ? error.reponse.data
                                        : null}
                                </Typography>
                                {requests && requests.length > 0 ? (
                                    <List className={classes.list}>
                                        {requests.map(
                                            (
                                                _r: any,
                                                index: number,
                                                arr: any[]
                                            ) => renderRow({ data: arr, index })
                                        )}
                                    </List>
                                ) : (
                                    <Typography>No Requests</Typography>
                                )}
                            </CardContent>
                        </>
                    )}
                </Card>
            </Popover>
        </>
    );
};

export default EventCategory;
