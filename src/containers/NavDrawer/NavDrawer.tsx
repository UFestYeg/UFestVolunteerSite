import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Typography,
} from "@material-ui/core";
// tslint:disable-next-line: no-submodule-imports
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
    AccessibilityNew as AccessibilityNewIcon,
    AccountBalance as AccountBalanceIcon,
    AccountCircle as AccountCircleIcon,
    CalendarToday as CalendarTodayIcon,
    ExitToApp as ExitToAppIcon,
    PermContactCalendar,
} from "@material-ui/icons";
import React from "react";
import { useDispatch } from "react-redux";
import { NavLink, useRouteMatch } from "react-router-dom";
import { auth as actions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";

const useStyles = makeStyles((theme) => ({
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

const NavListItem = ({
    text,
    icon,
    to,
    activeClassName,
    onClose,
}: NavListItemProps) => {
    return (
        <ListItem
            button
            component={NavLink}
            exact={true}
            to={to}
            activeClassName={activeClassName}
            onClick={() => onClose(false)}
        >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
        </ListItem>
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
    const classes = useStyles(theme);
    const dispatch = useDispatch();
    const match = useRouteMatch();
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
                    <NavListItem
                        to={"admin/"}
                        icon={<AccountBalanceIcon />}
                        text="Admin Dashboard"
                        activeClassName={classes.active}
                        onClose={onCloseFunc}
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
