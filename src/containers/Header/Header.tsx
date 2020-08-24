// tslint:disable: use-simple-attributes
import {
    AppBar,
    Avatar,
    Box,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    useMediaQuery,
} from "@material-ui/core";
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import { Menu as MenuIcon } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Copyright from "../../components/Copyright";
import { auth as authActions, user as userActions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import { userAvatarString } from "../../store/utils";
import "./Header.css";

interface HeaderProps {
    onMenuClick: (clicked: boolean) => void;
}

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            background: theme.palette.secondary.main,
            border: 0,
            color: theme.palette.primary.dark,
            padding: theme.spacing(1),
            flexGrow: 1,
            "& a": { textDecoration: "none" },
        },
        copyright: {
            padding: theme.spacing(2),
            marginTop: "calc(5% + 60px)",
        },
        logo: {
            marginLeft: theme.spacing(3),
        },
        avatar: {
            width: theme.spacing(7),
            height: theme.spacing(7),
        },
        avatarSmall: {
            width: theme.spacing(5),
            height: theme.spacing(5),
        },
        name: {
            display: "inline-block",
            marginLeft: theme.spacing(2),
        },
        button: {
            backgroundColor: theme.palette.primary.dark,
            color: "white",
        },
        logout: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
        menuItem: {
            background: theme.palette.secondary.main,
        },
        menuList: {
            "& ul": {
                backgroundColor: theme.palette.secondary.main,
            },
        },
    })
);

const Header: React.FC<HeaderProps> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    // const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
    const isAuthenticated = StateHooks.useIsAuthenticated();
    const open = Boolean(anchorEl);
    const xsmallWidth = useMediaQuery(theme.breakpoints.down("xs"));
    const smallWidth = useMediaQuery(theme.breakpoints.down("sm"));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userActions.getUserProfile());
    }, [dispatch]);

    const userProfile = StateHooks.useUserProfile();

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        // logout({ returnTo: window.location.origin });
        dispatch(authActions.logout());
    };
    return (
        <>
            <AppBar position="static" className={classes.root}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={() => props.onMenuClick(true)}
                    >
                        <MenuIcon
                            fontSize={xsmallWidth ? "default" : "large"}
                        />
                    </IconButton>
                    <Typography
                        variant={
                            smallWidth ? (xsmallWidth ? "h6" : "h4") : "h5"
                        }
                        className={classes.root}
                        component="a"
                        href={isAuthenticated ? "/volunteer" : "/"}
                    >
                        UFest Volunteering
                    </Typography>
                    {!isAuthenticated && (
                        <Button
                            id="login-button"
                            size="medium"
                            className={classes.button}
                            onClick={() => {}} // loginWithRedirect({})}
                        >
                            Login
                        </Button>
                    )}
                    {isAuthenticated && (
                        <div>
                            <Button
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                                // variant="outlined"
                            >
                                <Avatar className={classes.avatar}>
                                    {userAvatarString(userProfile)}
                                </Avatar>
                            </Button>
                            <Menu
                                id="menu-appbar"
                                elevation={0}
                                getContentAnchorEl={null}
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "center",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                                open={open}
                                onClose={handleClose}
                                className={classes.menuList}
                            >
                                <Link
                                    to={"/volunteer/profile/info"}
                                    style={{ textDecoration: "none" }}
                                >
                                    <MenuItem
                                        className={classes.menuItem}
                                        onClick={handleClose}
                                    >
                                        <Typography
                                            variant="subtitle2"
                                            className={classes.logout}
                                        >
                                            Profile
                                        </Typography>
                                    </MenuItem>
                                </Link>
                                <MenuItem
                                    className={classes.menuItem}
                                    onClick={handleLogout}
                                >
                                    <Typography
                                        variant="subtitle2"
                                        className={classes.logout}
                                    >
                                        logout
                                    </Typography>
                                </MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
            {props.children}
            <Box mt={8} bgcolor="primary.main" className={classes.copyright}>
                <Copyright />
            </Box>
        </>
    );
};

export default Header;
