import React from "react";
import { Redirect, Route } from "react-router-dom";
import { StateHooks } from "../../store/hooks";

interface IProtectedRouteProps {
    component: React.FC<any>;
    path: string;
    exact?: boolean;
    canEdit?: boolean;
    staffOnly?: boolean;
}

const ProtectedRoute: React.FC<IProtectedRouteProps> = ({
    component: Component,
    canEdit,
    staffOnly,
    ...rest
}) => {
    const [_loading, isAuthenticated] = StateHooks.useAuthInfo();
    const userProfile = StateHooks.useUserProfile();

    const shouldRender = () => {
        return (
            isAuthenticated === true &&
            (staffOnly ? userProfile.is_staff : true)
        );
    };

    const render = (props: any) =>
        shouldRender() ? (
            <Component {...props} />
        ) : (
            <Redirect
                to={{
                    pathname: "/login",
                    state: {
                        from: props.location,
                    },
                }}
            />
        );

    const renderRoute = () => render({ canEdit });

    return <Route {...rest} render={renderRoute} />;
};

export default ProtectedRoute;
