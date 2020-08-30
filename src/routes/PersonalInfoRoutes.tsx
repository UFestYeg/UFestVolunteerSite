import React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { NotFoundPage } from "../components/NotFoundPage";
import { ProfileCalendar, ProfileInfo } from "../components/ProfilePage";
import { ProtectedRoute } from "../components/ProtectedRoute";

const ProfileRoutes: React.FC = () => {
    const { path } = useRouteMatch();

    return (
        <React.Fragment>
            <Switch>
                <Route exact path={`${path}`}>
                    <Redirect to={`${path}/info`} />
                </Route>
                <ProtectedRoute
                    exact
                    canEdit={true}
                    path={`${path}/info`}
                    component={ProfileInfo}
                />
                <ProtectedRoute
                    exact
                    path={`${path}/schedule`}
                    component={ProfileCalendar}
                />
                <ProtectedRoute path="*" component={NotFoundPage} />
            </Switch>
        </React.Fragment>
    );
};

export default ProfileRoutes;
