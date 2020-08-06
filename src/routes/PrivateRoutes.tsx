import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { EventsCalendar } from "../components/Calendar";
import { HomePage } from "../components/HomePage";
import { NotFoundPage } from "../components/NotFoundPage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { ScheduleEventDetails } from "../components/ScheduleEventDetails";
import { ScheduleEventList } from "../components/ScheduleEventList";
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
                    path={`${path}/events`}
                    component={ScheduleEventList}
                />
                <ProtectedRoute
                    path={`${path}/events/:eventID`}
                    component={ScheduleEventDetails}
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
