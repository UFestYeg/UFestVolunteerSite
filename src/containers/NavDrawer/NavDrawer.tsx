import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@material-ui/core";
// tslint:disable-next-line: no-submodule-imports
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
    AccessibilityNew as AccessibilityNewIcon,
    AccountCircle as AccountCircleIcon,
    CalendarToday as CalendarTodayIcon,
    Event as EventIcon,
    ExitToApp as ExitToAppIcon,
    PermContactCalendar,
    Settings as SettingsIcon,
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
            <List className={classes.inactive}>
                {is_staff ? (
                    <>
                        <NavListItem
                            to={`${match.url}/positions`}
                            icon={<EventIcon />}
                            text="Schedule"
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
                    </>
                ) : null}
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
                {is_staff ? (
                    <NavListItem
                        to={`${match.url}/settings`}
                        icon={<SettingsIcon />}
                        text="Settings"
                        activeClassName={classes.active}
                        onClose={onCloseFunc}
                    />
                ) : null}
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
