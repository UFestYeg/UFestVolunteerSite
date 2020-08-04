import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { NotFoundPage } from "../components/NotFoundPage";
import { PasswordChange } from "../components/PasswordChange";
import { ProfileEditPage } from "../components/ProfileEditPage";
import { ProfilePage } from "../components/ProfilePage";
import { ProtectedRoute } from "../components/ProtectedRoute";

const ProfileRoutes: React.FC = () => {
    const { path } = useRouteMatch();

    return (
        <React.Fragment>
            <Switch>
                <ProtectedRoute
                    exact
                    path={`${path}`}
                    component={ProfilePage}
                />
                <ProtectedRoute
                    path={`${path}/change_password`}
                    component={PasswordChange}
                />
                <ProtectedRoute
                    path={`${path}/edit`}
                    component={ProfileEditPage}
                />
                <Route component={NotFoundPage} />
            </Switch>
        </React.Fragment>
    );
};

export default ProfileRoutes;
