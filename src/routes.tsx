import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";

import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ScheduleEventDetails } from "./components/ScheduleEventDetails";
import { ScheduleEventList } from "./components/ScheduleEventList";
import { SignUpPage } from "./components/SignUpPage";
import { Header } from "./containers/Header";
import { NavDrawer } from "./containers/NavDrawer";
import { ProfilePage } from "./components/ProfilePage";

const BaseRouter: React.FC = () => {
    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
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
                    <ProtectedRoute path="/profile" component={ProfilePage} />
                </Header>
            </Switch>
            <NavDrawer open={open} onCloseFunc={setOpen} />
        </React.Fragment>
    );
};

export default BaseRouter;
