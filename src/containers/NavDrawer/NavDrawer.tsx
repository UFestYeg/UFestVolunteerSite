import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Typography,
} from "@mui/material";
// tslint:disable-next-line: no-submodule-imports
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import {
    AccessibilityNew as AccessibilityNewIcon,
    AccountBalance as AccountBalanceIcon,
    AccountCircle as AccountCircleIcon,
    CalendarToday as CalendarTodayIcon,
    ExitToApp as ExitToAppIcon,
    PermContactCalendar,
} from "@mui/icons-material";
import React from "react";
import { StateHooks } from "../../store/hooks";
import { NavLink, useMatch } from "react-router-dom";
import { auth as actions } from "../../store/actions";
import { ROOT_URL } from "../../constants";

const useStyles = makeStyles()((theme) => ({
    active: {
        background: theme.palette.primary.main,
        color: "white",
        "& svg": {
            fill: "white",
            "& path": {
                fill: "white!important",
            },
        },
        "&:hover": {
            background: theme.palette.primary.main,
        },
    },
    inactive: {
        color: "rgba(0, 0, 0, 0.54)",
    },
    subheader: {
        background: theme.palette.primary.dark,
    },
}));

interface NavListItemProps {
    text: string;
    icon: JSX.Element;
    to: string;
    activeClassName: string;
    onClose: Function;
}

interface LinkListItemProps {
    text: string;
    icon: JSX.Element;
    href: string;
}

const NavListItem = ({
    text,
    icon,
    to,
    activeClassName,
    onClose,
}: NavListItemProps) => {
    const isActive = useMatch({ path: to, end: true }) !== null;
    return (
        <ListItemButton
            component={NavLink}
            end
            to={to}
            className={isActive ? activeClassName : ""}
            onClick={() => onClose(false)}
        >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
        </ListItemButton>
    );
};

const LinkListItem = ({ text, icon, href }: LinkListItemProps) => {
    return (
        <ListItemButton component="a" href={href}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
        </ListItemButton>
    );
};

interface NavDrawerProps {
    open: boolean;
    onCloseFunc: Function;
}

const NavDrawer: React.FC<NavDrawerProps> = ({
    open,
    onCloseFunc,
}: NavDrawerProps) => {
    const theme = useTheme();
    const { classes } = useStyles();
    const dispatch = StateHooks.useAppDispatch();
    const match = { url: "/volunteer" };
    const userProfile = StateHooks.useUserProfile();
    const { is_staff } = userProfile;
    const handleLogout = () => {
        onCloseFunc(false);
        // logout({ returnTo: window.location.origin });
        dispatch(actions.logout());
    };
    return (
        <Drawer open={open} onClose={() => onCloseFunc(false)}>
            {is_staff ? (
                <List
                    className={classes.inactive}
                    subheader={
                        <ListSubheader
                            component="div"
                            id="nested-admin-list-subheader"
                            className={classes.subheader}
                        >
                            <Typography variant="subtitle1">
                                Admin Menu
                            </Typography>
                        </ListSubheader>
                    }
                >
                    <LinkListItem
                        href={`${ROOT_URL}admin/`}
                        icon={<AccountBalanceIcon />}
                        text="Admin Dashboard"
                    />
                    <NavListItem
                        to={`${match.url}/calendar`}
                        icon={<CalendarTodayIcon />}
                        text="Calendar"
                        activeClassName={classes.active}
                        onClose={onCloseFunc}
                    />
                </List>
            ) : null}
            <List
                className={classes.inactive}
                subheader={
                    <ListSubheader
                        component="div"
                        id="nested-list-subheader"
                        className={classes.subheader}
                    >
                        <Typography variant="subtitle1">
                            Volunteer Menu
                        </Typography>
                    </ListSubheader>
                }
            >
                <NavListItem
                    to={`${match.url}/profile/schedule`}
                    icon={<PermContactCalendar />}
                    text="My Schedule"
                    activeClassName={classes.active}
                    onClose={onCloseFunc}
                />
                <NavListItem
                    to={`${match.url}/categories`}
                    icon={<AccessibilityNewIcon />}
                    text="Volunteer"
                    activeClassName={classes.active}
                    onClose={onCloseFunc}
                />
                <NavListItem
                    to={`${match.url}/profile/info`}
                    icon={<AccountCircleIcon />}
                    text="Profile"
                    activeClassName={classes.active}
                    onClose={onCloseFunc}
                />
                <NavListItem
                    to=""
                    icon={<ExitToAppIcon />}
                    text="Logout"
                    activeClassName={classes.active}
                    onClose={handleLogout}
                />
            </List>
        </Drawer>
    );
};

export default NavDrawer;
