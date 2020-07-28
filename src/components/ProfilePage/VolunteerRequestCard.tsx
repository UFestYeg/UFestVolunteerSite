import {
    Avatar,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";

const useStyles = makeStyles((theme) => ({
    card: {
        width: "100%",
        marginTop: theme.spacing(1),
    },
}));

const VolunteerRequestCard: React.FC = () => {
    const classes = useStyles();
    return (
        <Card className={classes.card}>
            <CardHeader
                action={
                    <IconButton aria-label="settings">
                        <CloseIcon />
                    </IconButton>
                }
            />
            <CardContent>
                <Grid
                    container
                    direction="row"
                    xs={10}
                    justify="space-between"
                    alignItems="baseline"
                >
                    <Typography variant="h6">Type/Position Title</Typography>
                    <Typography variant="body1">Location</Typography>
                    <Typography variant="body1">Time</Typography>
                    <Typography variant="h6">Status</Typography>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default VolunteerRequestCard;
