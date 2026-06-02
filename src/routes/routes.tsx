import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
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
import PrivateRoutes from "./PrivateRoutes";

const BaseRouter: React.FC = () => {
    const [open, setOpen] = useState(false);

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/account/confirm-email/:key"
                element={<AccountActivation />}
            />
            <Route path="/signup_done" element={<SignupDone />} />
            <Route
                path="/volunteer/*"
                element={
                    <React.Fragment>
                        <Header onMenuClick={setOpen}>
                            <PrivateRoutes />
                        </Header>
                        <NavDrawer open={open} onCloseFunc={setOpen} />
                    </React.Fragment>
                }
            />
            <Route path="/reset_password" element={<PasswordReset />} />
            <Route
                path="/reset_password_done"
                element={<PasswordResetDone />}
            />
            <Route
                path="/reset/:uid/:token/"
                element={<PasswordResetConfirm />}
            />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default BaseRouter;
