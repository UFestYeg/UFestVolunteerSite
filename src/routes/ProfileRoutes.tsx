import React from "react";
import { Switch, useRouteMatch } from "react-router-dom";
import { NotFoundPage } from "../components/NotFoundPage";
import { PasswordChange } from "../components/PasswordChange";
import { ProfileEditPage } from "../components/ProfileEditPage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { ProfileBase } from "../containers/ProfileBase";
import PersonalInfoRoutes from "./PersonalInfoRoutes";

const ProfileRoutes: React.FC = () => {
    const { path, url } = useRouteMatch();

    const tabs = [
        { target: `${url}/info`, label: "My Profile" },
        {
            label: "My Schedule",
            target: `${url}/schedule`,
        },
        {
            label: "My Summary",
            target: `${url}/summary`,
        },
    ];

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
                <ProfileBase useTabs tabs={tabs}>
                    <ProtectedRoute
                        path={`${path}`}
                        component={PersonalInfoRoutes}
                    />
                </ProfileBase>
                <ProtectedRoute path="*" component={NotFoundPage} />
            </Switch>
        </React.Fragment>
    );
};

export default ProfileRoutes;
