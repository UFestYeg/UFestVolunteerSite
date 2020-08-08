import {
    Button,
    Grid,
    ListItem,
    ListItemProps,
    Typography,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
    Theme,
    useTheme,
} from "@material-ui/core/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { UserUrls } from "../../constants";
import { volunteer as volunteerActions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import { CustomForm } from "../Form";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            // maxWidth: 360,
            backgroundColor: theme.palette.background.paper,
        },
    })
);

function ListItemLink(props: ListItemProps<"a", { button?: true }>) {
    return <ListItem button component="a" {...props} />;
}

type SimpleListType = {
    events: VolunteerCategoryType[];
};

type VolunteerCategoryType = {
    id: number;
    title: string;
    start_time: Date;
    end_time: Date;
    number_of_slots: number;
};

const VolunteerCategoryDetails: React.FC<any> = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const { positionID } = useParams();
    const dispatch = useDispatch();
    const [currentEvent, setEvent] = useState<VolunteerCategoryType>();
    const token = StateHooks.useToken();
    const history = useHistory();

    useEffect(() => {
        if (token && positionID) {
            dispatch(volunteerActions.getVolunteerCategoryTypes());
            axios.defaults.headers = {
                Authorization: token,
                "Content-Type": "application/json",
            };
            axios.get(UserUrls.POSITION_DETAILS(positionID)).then((res) => {
                setEvent(res.data);
                console.log(res.data);
            });
        }
    }, [positionID, token]);

    const handleDelete = () => {
        if (token && positionID) {
            axios.delete(UserUrls.POSITION_DETAILS(positionID));
            history.push("/positions");
        }
    };

    return (
        <div className={classes.root}>
            <Typography variant="h2">Detail Page</Typography>
            {currentEvent !== undefined ? (
                <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="flex-start"
                >
                    <Grid item>
                        <Typography variant="h5">
                            {currentEvent.title}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                    >
                        <Grid
                            item
                            container
                            direction="column"
                            xs={5}
                            justify="flex-start"
                            alignItems="flex-start"
                        >
                            <Typography variant="subtitle1">Start:</Typography>
                            <Typography variant="body1">
                                {currentEvent.start_time}
                            </Typography>
                            <Typography variant="subtitle1">End:</Typography>
                            <Typography variant="body1">
                                {currentEvent.end_time}
                            </Typography>
                        </Grid>
                        <Grid item xs={7}>
                            <Typography variant="subtitle1">
                                Description
                            </Typography>
                            <Typography variant="body1">
                                description of the event
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        justify="flex-start"
                        alignItems="flex-start"
                    >
                        <Typography variant="body1">
                            Number of volunteer slots available:{" "}
                            {currentEvent.number_of_slots}
                        </Typography>
                    </Grid>
                </Grid>
            ) : null}
            <CustomForm
                requestTypeProp="PUT"
                eventIdProp={positionID}
                buttonText="Update"
            />
            <form onSubmit={handleDelete}>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                >
                    Delete
                </Button>
            </form>
        </div>
    );
};

export default VolunteerCategoryDetails;
