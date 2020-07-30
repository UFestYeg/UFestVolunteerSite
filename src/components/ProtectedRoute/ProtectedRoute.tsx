import React from "react";
import { Redirect, Route } from "react-router-dom";
import { StateHooks } from "../../store/hooks";

interface IProtectedRouteProps {
    component: React.FC<{}>;
    path: string;
    exact?: boolean;
}

const ProtectedRoute: React.FC<IProtectedRouteProps> = ({
    component: Component,
    ...rest
}) => {
    const [_loading, isAuthenticated] = StateHooks.useAuthInfo();

    const render = (props: any) =>
        isAuthenticated === true ? (
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

    return <Route {...rest} render={render} />;
};

export default ProtectedRoute;
