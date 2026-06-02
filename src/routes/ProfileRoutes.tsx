import React from "react";
import { Route, Routes } from "react-router-dom";
import { PasswordChange } from "../components/PasswordChange";
import { ProfileEditPage } from "../components/ProfileEditPage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { ProfileBase } from "../containers/ProfileBase";
import PersonalInfoRoutes from "./PersonalInfoRoutes";

const ProfileRoutes: React.FC = () => {
    const base = "/volunteer/profile";

    const tabs = [
        { target: `${base}/info`, label: "My Profile" },
        {
            label: "My Schedule",
            target: `${base}/schedule`,
        },
        {
            label: "My Summary",
            target: `${base}/summary`,
        },
    ];

    return (
        <Routes>
            <Route
                path="change_password"
                element={<ProtectedRoute component={PasswordChange} />}
            />
            <Route
                path="edit"
                element={<ProtectedRoute component={ProfileEditPage} />}
            />
            <Route
                path="*"
                element={
                    <ProfileBase useTabs tabs={tabs}>
                        <PersonalInfoRoutes />
                    </ProfileBase>
                }
            />
        </Routes>
    );
};

export default ProfileRoutes;
