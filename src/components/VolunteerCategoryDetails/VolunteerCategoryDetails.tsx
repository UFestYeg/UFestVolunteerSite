import { Button, Grid, Typography } from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { StateHooks } from "../../store/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { VolunteerUrls } from "../../constants";
import { volunteer as volunteerActions } from "../../store/actions";
import { setAuthHeaders } from "../../store/actions/apiUtils";
import { CustomForm } from "../Form";

const useStyles = makeStyles()((theme: Theme) =>
    ({
        root: {
            backgroundColor: theme.palette.background.paper,
            width: "100%",
        },
    })
);

type VolunteerCategoryType = {
    id: number;
    title: string;
    start_time: Date;
    end_time: Date;
    number_of_positions: number;
};

const VolunteerCategoryDetails: React.FC<any> = () => {
    const theme = useTheme();
    const { classes } = useStyles();
    const { positionID: positionIDStr } = useParams<{ positionID?: string }>();
    const positionID = positionIDStr ? parseInt(positionIDStr, 10) : NaN;
    const dispatch = StateHooks.useAppDispatch();
    const [cookies, _setCookie] = useCookies(["csrftoken"]);
    const [currentEvent, setEvent] = useState<VolunteerCategoryType>();
    const token = StateHooks.useToken();
    const navigate = useNavigate();

    useEffect(() => {
        if (token && !isNaN(positionID)) {
            dispatch(
                volunteerActions.getVolunteerCategoryTypes(cookies.csrftoken)
            );
            setAuthHeaders(token, cookies.csrftoken);
            axios
                .get(VolunteerUrls.CATEGORY_DETAILS(positionID))
                .then((res) => {
                    setEvent(res.data);
                });
        }
    }, [cookies.csrftoken, dispatch, positionID, token]);

    const handleDelete = () => {
        if (token && !isNaN(positionID)) {
            axios.delete(VolunteerUrls.CATEGORY_DETAILS(positionID));
            navigate("/positions");
        }
    };

    return (
        <div className={classes.root}>
            <Typography variant="h2">Detail Page</Typography>
            {currentEvent !== undefined ? (
                <Grid
                    container
                    direction="column"
                    justifyContent="flex-start"
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
                        justifyContent="flex-start"
                        alignItems="flex-start"
                    >
                        <Grid
                            item
                            container
                            direction="column"
                            xs={5}
                            justifyContent="flex-start"
                            alignItems="flex-start"
                        >
                            <Typography variant="subtitle1">Start:</Typography>
                            <Typography variant="body1">
                                {String(currentEvent.start_time)}
                            </Typography>
                            <Typography variant="subtitle1">End:</Typography>
                            <Typography variant="body1">
                                {String(currentEvent.end_time)}
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
                        justifyContent="flex-start"
                        alignItems="flex-start"
                    >
                        <Typography variant="body1">
                            Number of volunteer slots available:{" "}
                            {currentEvent.number_of_positions}
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
