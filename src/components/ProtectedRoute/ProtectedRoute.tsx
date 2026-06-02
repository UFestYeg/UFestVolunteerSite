import React from "react";
import { Navigate } from "react-router-dom";
import { StateHooks } from "../../store/hooks";

interface IProtectedRouteProps {
    component: React.FC<any>;
    canEdit?: boolean;
    staffOnly?: boolean;
}

const ProtectedRoute: React.FC<IProtectedRouteProps> = ({
    component: Component,
    canEdit,
    staffOnly,
}) => {
    const [_loading, isAuthenticated] = StateHooks.useAuthInfo();
    const userProfile = StateHooks.useUserProfile();

    const shouldRender =
        isAuthenticated === true && (staffOnly ? userProfile.is_staff : true);

    if (!shouldRender) {
        return <Navigate to="/login" replace />;
    }

    return <Component canEdit={canEdit} />;
};

export default ProtectedRoute;
