import {
    List,
    ListItem,
    ListItemProps,
    ListItemText,
    Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

type ScheduleEventType = {
    id: number;
    title: string;
    start_time: Date;
    end_time: Date;
    number_of_slots: number;
};

const ScheduleEventList: React.FC = () => {
    const classes = useStyles();
    const [currentList, setList] = useState<ScheduleEventType[]>([]);
    const token = StateHooks.useToken();

    useEffect(() => {
        if (token && process.env["REACT_APP_API_URI"] !== undefined) {
            axios.defaults.headers = {
                Authorization: token,
                "Content-Type": "application/json",
            };

            axios
                .get(`${process.env["REACT_APP_API_URI"]}api/events`)
                .then((res) => {
                    setList(res.data);
                    console.log(res.data);
                });
        }
    }, [token]);

    return (
        <div className={classes.root}>
            <Typography variant="h2">List Page</Typography>
            <List component="nav" aria-label="schedule event list">
                {currentList.map((value, _idx, _arr) => {
                    return (
                        <ListItem
                            button
                            component={Link}
                            to={`volunteer/events/${value.id}`}
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

export default ScheduleEventList;
