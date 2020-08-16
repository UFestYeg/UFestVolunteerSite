import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { NotFoundPage } from "../components/NotFoundPage";
import { PasswordChange } from "../components/PasswordChange";
import { ProfileEditPage } from "../components/ProfileEditPage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { ProfileBase } from "../containers/ProfileBase";
import PersonalInfoRoutes from "./PersonalInfoRoutes";

const ProfileRoutes: React.FC = () => {
    const { path } = useRouteMatch();

    return (
        <React.Fragment>
            <Switch>
                <ProtectedRoute
                    path={`${path}/change_password`}
                    component={PasswordChange}
                />
                <ProtectedRoute
                    path={`${path}/edit`}
                    component={ProfileEditPage}
                />
                <ProfileBase>
                    <ProtectedRoute
                        path={`${path}`}
                        component={PersonalInfoRoutes}
                    />
                </ProfileBase>
                <Route component={NotFoundPage} />
            </Switch>
        </React.Fragment>
    );
};

export default ProfileRoutes;
