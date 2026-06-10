import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { CategorySelectPage } from "../components/CategorySelectPage";
import { HomePage } from "../components/HomePage";
import { Loading } from "../components/Loading";
import { NotFoundPage } from "../components/NotFoundPage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { RoleSelectPage } from "../components/RoleSelectPage";
import ProfileRoutes from "./ProfileRoutes";
import UserRoutes from "./UserRoutes";

// Code-split the calendar-heavy routes. EventsCalendar, PositionRequestPage and
// VolunteerCategoryDetails pull in react-big-calendar + moment (~130KB gzip), so
// loading them lazily keeps that weight out of the initial bundle for users who
// only ever hit the landing/home/category pages.
const EventsCalendar = React.lazy(
    () => import("../components/Calendar/EventsCalendar")
);
const PositionRequestPage = React.lazy(
    () => import("../components/PositionRequestPage/PositionRequestPage")
);
const VolunteerCategoryDetails = React.lazy(() =>
    import("../components/VolunteerCategoryDetails").then((m) => ({
        default: m.VolunteerCategoryDetails,
    }))
);

// ProtectedRoute only forwards `canEdit`, so wrap PositionRequestPage to set
// the full-calendar mode for the "browse everything" route.
const FullCalendarPage: React.FC = () => <PositionRequestPage allCategories />;

const PrivateRoutes: React.FC = () => {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route
                    index
                    element={<ProtectedRoute component={HomePage} />}
                />
                <Route
                    path="calendar"
                    element={
                        <ProtectedRoute staffOnly component={EventsCalendar} />
                    }
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
                    element={
                        <ProtectedRoute component={PositionRequestPage} />
                    }
                />
                <Route
                    path="profile/*"
                    element={<ProtectedRoute component={ProfileRoutes} />}
                />
                <Route
                    path="users/*"
                    element={
                        <ProtectedRoute staffOnly component={UserRoutes} />
                    }
                />
                <Route
                    path="*"
                    element={<ProtectedRoute component={NotFoundPage} />}
                />
            </Routes>
        </Suspense>
    );
};

export default PrivateRoutes;
