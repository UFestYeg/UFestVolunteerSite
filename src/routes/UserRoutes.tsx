import React from "react";
import { Route, Routes } from "react-router-dom";
import { NotFoundPage } from "../components/NotFoundPage";
import ProfileInfo from "../components/ProfilePage/ProfileInfo";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { ProfileBase } from "../containers/ProfileBase";

const UserRoutes: React.FC = () => {
    return (
        <Routes>
            <Route
                path=":profileID"
                element={
                    <ProtectedRoute staffOnly component={WrappedUserRoutes} />
                }
            />
            <Route
                path="*"
                element={<ProtectedRoute component={NotFoundPage} />}
            />
        </Routes>
    );
};
const WrappedUserRoutes: React.FC = () => {
    return (
        <ProfileBase useTabs={false}>
            <ProfileInfo canEdit={false} />
        </ProfileBase>
    );
};

export default UserRoutes;
