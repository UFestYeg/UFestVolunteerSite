import React from "react";
import { Route, Switch } from "react-router-dom";

import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { ScheduleEventDetails } from "./components/ScheduleEventDetails";
import { ScheduleEventList } from "./components/ScheduleEventList";
import { SignUpPage } from "./components/SignUpPage";

const BaseRouter: React.FC = () => (
    <Switch>
        <Route exact path="/">
            <LandingPage />
        </Route>
        <Route exact path="/events">
            <ScheduleEventList />
        </Route>
        <Route path="/events/:eventID">
            <ScheduleEventDetails />
        </Route>
        <Route path="/signup">
            <SignUpPage />
        </Route>
        <Route path="/login">
            <LoginPage />
        </Route>
    </Switch>
);

export default BaseRouter;
