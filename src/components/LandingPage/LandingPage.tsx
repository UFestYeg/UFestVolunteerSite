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
            borderRadius: 8,
            color: "white",
            paddingBlock: theme.spacing(2),
            margin: theme.spacing(2),
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
                width: "40%",
            },
            [theme.breakpoints.up("md")]: {
                float: "left",
                width: "40%",
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
            <Grid item xs={12} sm={6} className={styles.item}>
                <Typography variant="h1" className={styles.title}>
                    Volunteer @
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6} className={styles.item}>
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
                direction="column"
                justify="center"
                alignItems="stretch"
                spacing={0}
            >
                <Grid item className={styles.item}>
                    <Button
                        size="medium"
                        className={clsx(styles.login, styles.button)}
                        component={Link}
                        to={"/login"}
                    >
                        Login
                    </Button>
                </Grid>
                <Grid item className={styles.item}>
                    <Button
                        size="medium"
                        className={clsx(styles.signup, styles.button)}
                        component={Link}
                        to={"/signup"}
                    >
                        Sign up
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default LandingPage;
