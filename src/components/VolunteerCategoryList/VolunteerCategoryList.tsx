import { List, ListItem, ListItemText, Typography } from "@material-ui/core";
import {
    createStyles,
    makeStyles,
    Theme,
    useTheme,
} from "@material-ui/core/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { VolunteerUrls } from "../../constants";
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
    const classes = useStyles(theme);
    const dispatch = useDispatch();
    const [cookies, _setCookie] = useCookies(["csrftoken"]);
    const [currentList, setList] = useState<VolunteerCategoryType[]>([]);
    const token = StateHooks.useToken();

    useEffect(() => {
        if (token) {
            dispatch(
                volunteerActions.getVolunteerCategoryTypes(cookies.csrftoken)
            );
            axios.defaults.headers = {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
                "X-CSRFToken": cookies.csrftoken,
            };

            axios.get(VolunteerUrls.CATEGORY_LIST).then((res) => {
                setList(res.data);
                console.log(res.data);
            });
        }
    }, [token, cookies.csrftoken, dispatch]);

    return (
        <div className={classes.root}>
            <Typography variant="h2">List Page</Typography>
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
            <br />
            <Typography variant="h2">Create Event</Typography>
            <CustomForm requestTypeProp="POST" buttonText="Create" />
        </div>
    );
};

export default VolunteerCategoryList;
