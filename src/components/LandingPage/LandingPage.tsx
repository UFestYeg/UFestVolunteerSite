// tslint:disable: use-simple-attributes
import {
    Button,
    Fade,
    Grid,
    Typography,
    useMediaQuery,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
    Theme,
    useTheme,
} from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";
import { Link } from "react-router-dom";
// import "./Home.css";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            background: theme.palette.primary.main,
            border: 0,
            borderRadius: theme.spacing(2),
            // color: "white",
            paddingBlock: theme.spacing(3),
            margin: theme.spacing(3),
        },
        signup: {
            background: theme.palette.secondary.main,
            "&:hover": {
                background: theme.palette.secondary.dark,
            },
        },
        login: {
            background: theme.palette.primary.main,
            "&:hover": {
                background: theme.palette.primary.dark,
            },
        },
        container: {
            height: "100vh",
            marginTop: 16,
        },
        image: {
            [theme.breakpoints.down("md")]: {
                width: "90%",
            },
            [theme.breakpoints.up("md")]: {
                // float: "left",
                width: "90%",
            },
        },
        item: {
            marginTop: 16,
        },
        mobileContainer: {
            height: "100vh",
            width: "100vw",
        },
        title: {
            [theme.breakpoints.up("md")]: {
                float: "right",
            },
        },
    })
);
const LandingPage: React.FC = () => {
    const theme = useTheme();
    const styles = useStyles(theme);
    const mobile = !useMediaQuery("(min-width:400px)");
    const tablet = !useMediaQuery("(min-width:600px)");

    return (
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            className={mobile ? styles.mobileContainer : styles.container}
            spacing={mobile ? 0 : tablet ? 3 : 6}
        >
            <Grid
                container
                item
                xs={12}
                sm={9}
                className={styles.item}
                direction="column"
                justify="center"
                alignItems="flex-end"
            >
                <Typography align="right" variant="h2">
                    UFest Edmonton Ukranian Festival
                </Typography>
                <Typography align="right" variant="h3">
                    Volunteer Sign-up Portal
                </Typography>
            </Grid>
            <Grid container item xs={6} sm={3} className={styles.item}>
                <Fade in>
                    <img
                        className={styles.image}
                        src={
                            "https://static.wixstatic.com/media/200a9a_1b1578ceda154ba8a388a58e6bf99033~mv2_d_4167_4167_s_4_2.png"
                        }
                        alt="UFest"
                    />
                </Fade>
            </Grid>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="flex-start"
                spacing={1}
            >
                <Grid item className={styles.item}>
                    <Button
                        size="large"
                        className={clsx(styles.login, styles.button)}
                        component={Link}
                        to={"/login"}
                        color="primary"
                        variant="contained"
                        disableElevation
                    >
                        Login
                    </Button>
                </Grid>
                <Grid item className={styles.item}>
                    <Button
                        size="large"
                        className={clsx(styles.signup, styles.button)}
                        component={Link}
                        to={"/signup"}
                        color="secondary"
                        variant="contained"
                        disableElevation
                    >
                        Sign up
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default LandingPage;
