import { Link, Typography } from "@mui/material";
import React from "react";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}
            <Link color="inherit" href="https://ufest.ca/">
                UFest Edmonton
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

export default Copyright;
