import { useSelector } from "react-redux";
import { State } from "../types";

export const useIsAuthenticated = () => {
    return useSelector((state: State) => {
        return state.auth.token !== null;
    });
};

export const useFormFields = () => {
    const error = useSelector((state: State) => state.auth.error);
    const loading = useSelector((state: State) => state.auth.loading);
    return [loading, error];
};

export const useToken = () => {
    return useSelector((state: State) => state.auth.token);
};
