import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { NotFoundPage } from "../components/NotFoundPage";
import { ProfileInfo } from "../components/ProfilePage";
import { ProtectedRoute } from "../components/ProtectedRoute";

const ProfileRoutes: React.FC = () => {
    const { path } = useRouteMatch();

    return (
        <React.Fragment>
            <Switch>
                <ProtectedRoute
                    exact
                    canEdit={false}
                    path={`${path}/:profileID`}
                    component={ProfileInfo}
                />
                <Route component={NotFoundPage} />
            </Switch>
        </React.Fragment>
    );
};

export default ProfileRoutes;
