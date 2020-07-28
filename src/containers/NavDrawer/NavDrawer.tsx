import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
    AccountCircle as AccountCircleIcon,
    CalendarToday as CalendarTodayIcon,
    ExitToApp as ExitToAppIcon,
    Settings as SettingsIcon,
} from "@material-ui/icons";
import React from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { auth as actions } from "../../store/actions";

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
    const styles = useStyles();
    const dispatch = useDispatch();
    const handleLogout = () => {
        onCloseFunc(false);
        // logout({ returnTo: window.location.origin });
        dispatch(actions.logout());
    };
    return (
        <Drawer open={open} onClose={() => onCloseFunc(false)}>
            <List className={styles.inactive}>
                <NavListItem
                    to="/events"
                    icon={<CalendarTodayIcon />}
                    text="Schedule"
                    activeClassName={styles.active}
                    onClose={onCloseFunc}
                />
                <NavListItem
                    to="/profile"
                    icon={<AccountCircleIcon />}
                    text="Profile"
                    activeClassName={styles.active}
                    onClose={onCloseFunc}
                />
                <NavListItem
                    to="/settings"
                    icon={<SettingsIcon />}
                    text="Settings"
                    activeClassName={styles.active}
                    onClose={onCloseFunc}
                />
                <NavListItem
                    to=""
                    icon={<ExitToAppIcon />}
                    text="Logout"
                    activeClassName={styles.active}
                    onClose={handleLogout}
                />
            </List>
        </Drawer>
    );
};

export default NavDrawer;
