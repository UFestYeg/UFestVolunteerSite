import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";

import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ScheduleEventDetails } from "./components/ScheduleEventDetails";
import { ScheduleEventList } from "./components/ScheduleEventList";
import { SignUpPage } from "./components/SignUpPage";
import { Header } from "./containers/Header";

const BaseRouter: React.FC = () => {
    const [open, setOpen] = useState(false);

    return (
        <Switch>
            <Route exact path="/">
                <LandingPage />
            </Route>
            <Route path="/signup">
                <SignUpPage />
            </Route>
            <Route path="/login">
                <LoginPage />
            </Route>
            <Header onMenuClick={setOpen}>
                <ProtectedRoute
                    exact
                    path="/events"
                    component={ScheduleEventList}
                />
                <ProtectedRoute
                    path="/events/:eventID"
                    component={ScheduleEventDetails}
                />
            </Header>
        </Switch>
    );
};

export default BaseRouter;
