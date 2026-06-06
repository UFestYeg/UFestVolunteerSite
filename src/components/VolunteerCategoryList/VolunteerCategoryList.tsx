import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { StateHooks } from "../../store/hooks";
import { Link } from "react-router-dom";
import { VolunteerUrls } from "../../constants";
import { volunteer as volunteerActions } from "../../store/actions";
import { notifyApiError, setAuthHeaders } from "../../store/actions/apiUtils";
import { CustomForm } from "../Form";
import { Loading } from "../Loading";

const useStyles = makeStyles()((theme: Theme) =>
    ({
        root: {
            width: "100%",
            // maxWidth: 360,
            backgroundColor: theme.palette.background.paper,
        },
    })
);

type VolunteerCategoryType = {
    id: number;
    title: string;
    start_time: Date;
    end_time: Date;
    number_of_positions: number;
    category: string;
};

const VolunteerCategoryList: React.FC = () => {
    const theme = useTheme();
    const { classes } = useStyles();
    const dispatch = StateHooks.useAppDispatch();
    const [cookies, _setCookie] = useCookies(["csrftoken"]);
    const [currentList, setList] = useState<VolunteerCategoryType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const token = StateHooks.useToken();

    useEffect(() => {
        if (token) {
            dispatch(
                volunteerActions.getVolunteerCategoryTypes(cookies.csrftoken)
            );
            setAuthHeaders(token, cookies.csrftoken);

            setLoading(true);
            axios
                .get(VolunteerUrls.CATEGORY_LIST)
                .then((res) => {
                    setList(res.data);
                })
                .catch((err) =>
                    notifyApiError(err, "Unable to load categories.")
                )
                .finally(() => setLoading(false));
        }
    }, [token, cookies.csrftoken, dispatch]);

    return (
        <div className={classes.root}>
            <Typography variant="h2">List Page</Typography>
            {loading ? (
                <Loading />
            ) : currentList.length === 0 ? (
                <Typography variant="body1">
                    No volunteer categories have been created yet.
                </Typography>
            ) : (
                <List component="nav" aria-label="schedule event list">
                    {currentList.map((value, _idx, _arr) => {
                        return (
                            <ListItem
                                button
                                component={Link}
                                to={`positions/${value.id}`}
                                key={`list-${value.id}`}
                            >
                                <ListItemText primary={value.title} />
                            </ListItem>
                        );
                    })}
                </List>
            )}
            <br />
            <Typography variant="h2">Create Event</Typography>
            <CustomForm requestTypeProp="POST" buttonText="Create" />
        </div>
    );
};

export default VolunteerCategoryList;
