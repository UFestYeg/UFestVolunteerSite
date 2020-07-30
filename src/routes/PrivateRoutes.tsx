import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { NotFoundPage } from "../components/NotFoundPage";
import { ProfilePage } from "../components/ProfilePage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { ScheduleEventDetails } from "../components/ScheduleEventDetails";
import { ScheduleEventList } from "../components/ScheduleEventList";

const PrivateRoutes: React.FC = () => {
    const { path } = useRouteMatch();

    return (
        <React.Fragment>
            <Switch>
                <ProtectedRoute
                    exact
                    path={`${path}/events`}
                    component={ScheduleEventList}
                />
                <ProtectedRoute
                    exact
                    path={`${path}/events/:eventID`}
                    component={ScheduleEventDetails}
                />
                <ProtectedRoute
                    exact
                    path={`${path}/profile`}
                    component={ProfilePage}
                />
                <Route component={NotFoundPage} />
            </Switch>
        </React.Fragment>
    );
};

export default PrivateRoutes;
