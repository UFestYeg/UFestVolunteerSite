import React from "react";
import { Switch, useRouteMatch } from "react-router-dom";
import { NotFoundPage } from "../components/NotFoundPage";
import { ProfileInfo } from "../components/ProfilePage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { ProfileBase } from "../containers/ProfileBase";

const UserRoutes: React.FC = () => {
    const { path } = useRouteMatch();

    return (
        <React.Fragment>
            <Switch>
                <ProtectedRoute
                    exact
                    staffOnly
                    path={`${path}/:profileID(\\d+)`}
                    component={WrappedUserRoutes}
                />
                <ProtectedRoute path="*" component={NotFoundPage} />
            </Switch>
        </React.Fragment>
    );
};
const WrappedUserRoutes: React.FC = () => {
    return (
        <ProfileBase useTabs={false}>
            <ProfileInfo canEdit={false} />
        </ProfileBase>
    );
};

export default UserRoutes;
