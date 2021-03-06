import React, { useEffect, useState } from "react";
import Notifications, {
    NotificationsState,
} from "react-notification-system-redux";
import { Route, Switch } from "react-router-dom";
import { AccountActivation } from "../components/AccountActivation";
import { LandingPage } from "../components/LandingPage";
import { LoginPage } from "../components/LoginPage";
import { NotFoundPage } from "../components/NotFoundPage";
import { PasswordReset } from "../components/PasswordReset";
import { PasswordResetConfirm } from "../components/PasswordResetConfirm";
import { PasswordResetDone } from "../components/PasswordResetDone";
import { SignupDone } from "../components/SignupDone";
import { SignUpPage } from "../components/SignUpPage";
import { Header } from "../containers/Header";
import { NavDrawer } from "../containers/NavDrawer";
import { StateHooks } from "../store/hooks";
import PrivateRoutes from "./PrivateRoutes";

const BaseRouter: React.FC = () => {
    const [open, setOpen] = useState(false);
    const notifications = StateHooks.useNotifications();
    const [notificationState, setNotificationState] = useState<
        NotificationsState
    >();

    useEffect(() => {
        setNotificationState(notifications);
    }, [notifications]);

    return (
        <React.Fragment>
            <Notifications notifications={notificationState} />
            <Switch>
                <Route exact path="/" component={LandingPage} />
                <Route path="/signup" component={SignUpPage} />
                <Route path="/login" component={LoginPage} />
                <Route
                    path="/account/confirm-email/:key"
                    component={AccountActivation}
                />
                <Route path="/signup_done" component={SignupDone} />
                <Route path="/volunteer">
                    <Header onMenuClick={setOpen}>
                        <PrivateRoutes />
                    </Header>
                    <NavDrawer open={open} onCloseFunc={setOpen} />
                </Route>
                <Route path="/reset_password" component={PasswordReset} />
                <Route
                    path="/reset_password_done"
                    component={PasswordResetDone}
                />
                <Route
                    path="/reset/:uid/:token/"
                    component={PasswordResetConfirm}
                />
                <Route component={NotFoundPage} />
            </Switch>
        </React.Fragment>
    );
};

export default BaseRouter;
