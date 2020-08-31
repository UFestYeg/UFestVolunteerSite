import {
    Fab,
    Grid,
    Typography,
    useScrollTrigger,
    Zoom,
} from "@material-ui/core";
// tslint:disable-next-line: no-submodule-imports
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import { KeyboardArrowDown as KeyboardArrowDownIcon } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";
import { StateHooks } from "../../store/hooks";

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
    const userProfile = StateHooks.useUserProfile();
    const { is_staff } = userProfile;

    return (
        <main>
            <section id="home" className={clsx(classes.home, classes.parallax)}>
                <Typography variant="h1" style={{ fontWeight: "bold" }}>
                    {is_staff
                        ? "Welcome Admin!"
                        : "Thank you for signing up to volunteer at UFest!"}
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
                        <Typography variant="h2">To begin:</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h3">
                            1) Update Your Profile
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            Review your profile and update all the information
                            to make sure it is up to date. You can access your
                            profile by clicking on the side menu in the top left
                            corner or click your profile logo in the top right
                            corner and select Profile.
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h3">
                            2) Sign up to Volunteer
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            Check out the many ways you can contribute to our
                            festival. To sign up, choose a category, position
                            and shift-time. Fill out the form with the rest of
                            your information. The form can be found on the top
                            left side menu. Remember, you can sign up for more
                            than one shift, as long as they are not at the same
                            time.
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h3">
                            3) Review your Schedule
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            Once your shift is confirmed by UFest, you'll see it
                            in your schedule. Make sure it's the slot you signed
                            up for and that you're available. More details will
                            be sent to you prior to the festival.
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            If you have any questions, please email{" "}
                            <a href="mailto: volunteerufest@gmail.com">
                                volunteerufest@gmail.com
                            </a>{" "}
                            Thank you for volunteering and see you at UFest!
                        </Typography>
                    </Grid>
                </Grid>
            </section>
        </main>
    );
};

export default HomePage;
