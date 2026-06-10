import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { NotFoundPage } from "../components/NotFoundPage";
import {
    ProfileCalendar,
    ProfileInfo,
    VolunteerScheduleSummary,
} from "../components/ProfilePage";
import { ProtectedRoute } from "../components/ProtectedRoute";

const PersonalInfoRoutes: React.FC = () => {
    return (
        <Routes>
            <Route index element={<Navigate to="info" replace />} />
            <Route
                path="info"
                element={<ProtectedRoute canEdit component={ProfileInfo} />}
            />
            <Route
                path="schedule"
                element={<ProtectedRoute component={ProfileCalendar} />}
            />
            <Route
                path="summary"
                element={
                    <ProtectedRoute component={VolunteerScheduleSummary} />
                }
            />
            <Route
                path="*"
                element={<ProtectedRoute component={NotFoundPage} />}
            />
        </Routes>
    );
};

export default PersonalInfoRoutes;
