import React from "react";
import { Switch, useRouteMatch } from "react-router-dom";
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

const PrivateRoutes: React.FC = () => {
    const { path } = useRouteMatch();

    return (
        <React.Fragment>
            <Switch>
                <ProtectedRoute exact path={`${path}`} component={HomePage} />
                <ProtectedRoute
                    exact
                    staffOnly
                    path={`${path}/calendar`}
                    component={EventsCalendar}
                />
                <ProtectedRoute
                    staffOnly
                    path={`${path}/positions/:positionID(\\d+)`}
                    component={VolunteerCategoryDetails}
                />
                <ProtectedRoute
                    exact
                    path={`${path}/categories`}
                    component={CategorySelectPage}
                />
                <ProtectedRoute
                    exact
                    path={`${path}/categories/:categoryTypeID(\\d+)`}
                    component={RoleSelectPage}
                />
                <ProtectedRoute
                    path={`${path}/categories/:categoryTypeID(\\d+)/roles/:roleID(\\d+)`}
                    component={PositionRequestPage}
                />
                <ProtectedRoute
                    path={`${path}/profile`}
                    component={ProfileRoutes}
                />
                <ProtectedRoute
                    staffOnly
                    path={`${path}/users`}
                    component={UserRoutes}
                />
                <ProtectedRoute path="*" component={NotFoundPage} />
            </Switch>
        </React.Fragment>
    );
};

export default PrivateRoutes;
