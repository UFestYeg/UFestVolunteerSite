import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import { LandingPage } from "../components/LandingPage";
import { LoginPage } from "../components/LoginPage";
import { NotFoundPage } from "../components/NotFoundPage";
import { PasswordReset } from "../components/PasswordReset";
import { PasswordResetConfirm } from "../components/PasswordResetConfirm";
import { PasswordResetDone } from "../components/PasswordResetDone";
import { SignUpPage } from "../components/SignUpPage";
import { Header } from "../containers/Header";
import { NavDrawer } from "../containers/NavDrawer";
import PrivateRoutes from "./PrivateRoutes";

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
                <Route path="/volunteer">
                    <Header onMenuClick={setOpen}>
                        <PrivateRoutes />
                    </Header>
                    <NavDrawer open={open} onCloseFunc={setOpen} />
                </Route>
                <Route path="/reset_password">
                    <PasswordReset />
                </Route>
                <Route path="/reset_password_done">
                    <PasswordResetDone />
                </Route>
                <Route
                    path="/reset/:uid/:token/"
                    component={PasswordResetConfirm}
                >
                    <PasswordResetConfirm />
                </Route>
                <Route component={NotFoundPage} />
            </Switch>
        </React.Fragment>
    );
};

export default BaseRouter;
