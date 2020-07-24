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
