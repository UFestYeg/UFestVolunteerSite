import { useSelector } from "react-redux";
import { State } from "../types";

export const useIsAuthenticated = () => {
    return useSelector((state: State) => {
        return state.auth.token !== null;
    });
};

export const useAuthInfo = () => {
    const isAuthenticated = useIsAuthenticated();
    const loading = useSelector((state: State) => state.auth.loading);
    const error = useSelector((state: State) => state.auth.error);
    return [loading, isAuthenticated, error];
};

export const useToken = () => {
    return useSelector((state: State) => state.auth.token);
};

export const useLoading = () => {
    return useSelector((state: State) => state.auth.loading);
};

export const useError = () => {
    return useSelector((state: State) => state.auth.error);
};

export const useUserProfile = () => {
    return useSelector((state: State) => state.user.currentProfile);
};

export const useViewedUserProfile = () => {
    return useSelector((state: State) => state.user.viewedProfile);
};

export const useUserInfo = () => {
    const loading = useSelector((state: State) => state.user.loading);
    const error = useSelector((state: State) => state.user.error);
    return [useUserProfile(), loading, error];
};

export const useVolunteerCategoryTypes = () => {
    return useSelector((state: State) => state.volunteer.categoryTypes);
};

export const useVolunteerCategories = () => {
    return useSelector((state: State) => state.volunteer.categories);
};
export const useMappedRoles = () => {
    return useSelector((state: State) => state.volunteer.mappedRoles);
};

export const useVolunteerInfo = () => {
    const loading = useSelector((state: State) => state.volunteer.loading);
    const error = useSelector((state: State) => state.volunteer.error);
    return [useVolunteerCategories(), loading, error];
};
