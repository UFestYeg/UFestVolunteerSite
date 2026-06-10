import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Loading } from "../components/Loading";
import { NotFoundPage } from "../components/NotFoundPage";
import ProfileInfo from "../components/ProfilePage/ProfileInfo";
import VolunteerScheduleSummary from "../components/ProfilePage/VolunteerScheduleSummary";
import { ProtectedRoute } from "../components/ProtectedRoute";

// Lazy-load the schedule calendar so react-big-calendar/moment only load when
// the user opens their schedule, keeping them out of the initial bundle.
const ProfileCalendar = React.lazy(
    () => import("../components/ProfilePage/ProfileCalendar")
);

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
                element={
                    <Suspense fallback={<Loading />}>
                        <ProtectedRoute component={ProfileCalendar} />
                    </Suspense>
                }
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
