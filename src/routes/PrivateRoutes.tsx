import React from "react";
import { Route, Routes } from "react-router-dom";
import { EventsCalendar } from "../components/Calendar";
import { CategorySelectPage } from "../components/CategorySelectPage";
import { HomePage } from "../components/HomePage";
import { NotFoundPage } from "../components/NotFoundPage";
import { PositionRequestPage } from "../components/PositionRequestPage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { RoleSelectPage } from "../components/RoleSelectPage";
import { VolunteerCategoryDetails } from "../components/VolunteerCategoryDetails";
import ProfileRoutes from "./ProfileRoutes";
import UserRoutes from "./UserRoutes";

// ProtectedRoute only forwards `canEdit`, so wrap PositionRequestPage to set
// the full-calendar mode for the "browse everything" route.
const FullCalendarPage: React.FC = () => <PositionRequestPage allCategories />;

const PrivateRoutes: React.FC = () => {
    return (
        <Routes>
            <Route index element={<ProtectedRoute component={HomePage} />} />
            <Route
                path="calendar"
                element={<ProtectedRoute staffOnly component={EventsCalendar} />}
            />
            <Route
                path="positions/:positionID"
                element={
                    <ProtectedRoute
                        staffOnly
                        component={VolunteerCategoryDetails}
                    />
                }
            />
            <Route
                path="categories"
                element={<ProtectedRoute component={CategorySelectPage} />}
            />
            <Route
                path="categories/all"
                element={<ProtectedRoute component={FullCalendarPage} />}
            />
            <Route
                path="categories/:categoryTypeID"
                element={<ProtectedRoute component={RoleSelectPage} />}
            />
            <Route
                path="categories/:categoryTypeID/roles/:roleID"
                element={<ProtectedRoute component={PositionRequestPage} />}
            />
            <Route
                path="profile/*"
                element={<ProtectedRoute component={ProfileRoutes} />}
            />
            <Route
                path="users/*"
                element={<ProtectedRoute staffOnly component={UserRoutes} />}
            />
            <Route
                path="*"
                element={<ProtectedRoute component={NotFoundPage} />}
            />
        </Routes>
    );
};

export default PrivateRoutes;
