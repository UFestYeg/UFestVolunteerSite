import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { EventsCalendar } from "../components/Calendar";
import { CategorySelectPage } from "../components/CategorySelectPage";
import { HomePage } from "../components/HomePage";
import { NotFoundPage } from "../components/NotFoundPage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { VolunteerCategoryDetails } from "../components/VolunteerCategoryDetails";
import { VolunteerCategoryList } from "../components/VolunteerCategoryList";
import ProfileRoutes from "./ProfileRoutes";

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
                    path={`${path}/categories/:category`}
                    component={CategorySelectPage}
                />
                <ProtectedRoute
                    path={`${path}/categories/:category/:role`}
                    component={CategorySelectPage}
                />
                <ProtectedRoute
                    path={`${path}/profile`}
                    component={ProfileRoutes}
                />
                <Route component={NotFoundPage} />
            </Switch>
        </React.Fragment>
    );
};

export default PrivateRoutes;
