import {
    Fab,
    Grid,
    Typography,
    useScrollTrigger,
    Zoom,
} from "@material-ui/core";
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import { KeyboardArrowDown as KeyboardArrowDownIcon } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) =>
    createStyles({
        home: {
            minHeight: "60vh",
            width: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",

            "&::before": {
                backgroundImage:
                    "url(https://static.wixstatic.com/media/200a9a_ed3489c2b7154121ad59ddd473b70004~mv2.jpg)",
                opacity: 0.4,
                content: "''",
                position: "absolute",
                left: "0px",
                "z-index": "-1",
                height: "50vh",
                width: "100%",
                // Create the parallax scrolling effect
                backgroundAttachment: "fixed",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                // backgroundColor: "rgba(0,0,0,0.25)",
            },
        },
        about: {
            minHeight: "60vh",
            width: "100%",
            overflow: "hidden",
            padding: theme.spacing(6),
        },
        image: {
            position: "absolute",
            left: 0,
            top: "84px",
            "z-index": -1,
            opacity: 0.6,
            overflow: "hidden",
        },

        parallax: {
            // Create the parallax scrolling effect
            backgroundAttachment: "fixed",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
        },
        grid: {
            overflow: "hidden",
        },
        fab: {
            position: "fixed",
            bottom: theme.spacing(3),
            left: "50%",
        },
    })
);

const ScrollTop: React.FC = ({ children }) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const anchor = (
            (event.target as HTMLDivElement).ownerDocument || document
        ).querySelector("#about-anchor");

        if (anchor) {
            anchor.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    return (
        <Zoom in={!trigger}>
            <div
                onClick={handleClick}
                role="presentation"
                className={classes.fab}
            >
                {children}
            </div>
        </Zoom>
    );
};

const HomePage: React.FC = () => {
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <main>
            <section id="home" className={clsx(classes.home, classes.parallax)}>
                <Typography variant="h1" style={{ fontWeight: "bold" }}>
                    Thanks For Signing Up!
                </Typography>
                <ScrollTop>
                    <Fab
                        color="secondary"
                        size="small"
                        aria-label="scroll back to about"
                    >
                        <KeyboardArrowDownIcon />
                    </Fab>
                </ScrollTop>
            </section>
            <section
                id="about-anchor"
                className={clsx(classes.about, classes.grid)}
            >
                <Grid
                    container
                    direction="column"
                    justify="space-between"
                    alignItems="center"
                    spacing={8}
                >
                    <Grid item xs={12}>
                        <Typography variant="h2">Next Steps:</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h3">
                            Update Your Profile
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            To get started check out your profile and make sure
                            the information is up to date. You can access your
                            profile by clicking on the side menu in the top left
                            corner or your profile logo in the top right and
                            selecting Profile
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h3">Sign up!</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            Try signing up for a volunteer position! Check out
                            the many ways you can contribute to our wonderful
                            festival and help make it your own. Fill out the
                            form which can be found in the top left side menu.
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h3">
                            Check out your schedule!
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            See what you have on your plate for the week of the
                            festival. Check out the event calendar from the side
                            menu.
                        </Typography>
                    </Grid>
                </Grid>
            </section>
        </main>
    );
};

export default HomePage;
