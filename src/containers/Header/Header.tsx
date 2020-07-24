// tslint:disable: use-simple-attributes
import {
    AppBar,
    Avatar,
    Button,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    useMediaQuery,
} from "@material-ui/core";
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import { Menu as MenuIcon } from "@material-ui/icons";
import React, { useState } from "react";
// import { useAuth0 } from "../../contexts";
import { useDispatch } from "react-redux";
import { auth as actions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import "./Header.css";

interface HeaderProps {
    onMenuClick: (clicked: boolean) => void;
}

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            background: theme.palette.primary.light,
            border: 0,
            color: theme.palette.primary.dark,
            padding: theme.spacing(1),
            flexGrow: 1,
            "& a": { textDecoration: "none" },
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
    const UserImage: React.FC<any> = ({ user }: any) => {
        return (
            <Grid
                container
                direction="row"
                alignItems="center"
                justify="flex-start"
            >
                <Avatar
                    src={user.picture}
                    alt={user.name}
                    className={
                        xsmallWidth ? classes.avatarSmall : classes.avatar
                    }
                />
                {xsmallWidth ? null : (
                    <Typography variant="caption" className={classes.name}>
                        {user.name}
                    </Typography>
                )}
            </Grid>
        );
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        // logout({ returnTo: window.location.origin });
        dispatch(actions.logout());
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
                        href="/"
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
                                variant="outlined"
                            >
                                {/* <UserImage user={user} /> */}
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
                                {/* Handle logout here on click */}
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
        </>
    );
};

export default Header;
