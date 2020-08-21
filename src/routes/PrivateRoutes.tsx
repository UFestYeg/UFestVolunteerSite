import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { EventsCalendar } from "../components/Calendar";
import { CategorySelectPage } from "../components/CategorySelectPage";
import { HomePage } from "../components/HomePage";
import { NotFoundPage } from "../components/NotFoundPage";
import { PositionRequestPage } from "../components/PositionRequestPage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { RoleSelectPage } from "../components/RoleSelectPage";
import { VolunteerCategoryDetails } from "../components/VolunteerCategoryDetails";
import { VolunteerCategoryList } from "../components/VolunteerCategoryList";
import { ProfileBase } from "../containers/ProfileBase";
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
                    path={`${path}/calendar`}
                    component={EventsCalendar}
                />
                <ProtectedRoute
                    exact
                    path={`${path}/positions`}
                    component={VolunteerCategoryList}
                />
                <ProtectedRoute
                    path={`${path}/positions/:positionID`}
                    component={VolunteerCategoryDetails}
                />
                <ProtectedRoute
                    exact
                    path={`${path}/categories`}
                    component={CategorySelectPage}
                />
                <ProtectedRoute
                    exact
                    path={`${path}/categories/:categoryTypeID`}
                    component={RoleSelectPage}
                />
                <ProtectedRoute
                    path={`${path}/categories/:categoryTypeID/roles/:roleID`}
                    component={PositionRequestPage}
                />
                <ProtectedRoute
                    path={`${path}/profile`}
                    component={ProfileRoutes}
                />
                <ProfileBase useTabs={false}>
                    <ProtectedRoute
                        path={`${path}/users`}
                        component={UserRoutes}
                    />
                </ProfileBase>
                <Route component={NotFoundPage} />
            </Switch>
        </React.Fragment>
    );
};

export default PrivateRoutes;
