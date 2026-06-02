import type { NavigateFunction } from "react-router-dom";

let navigateRef: NavigateFunction | null = null;

export const setNavigator = (navigate: NavigateFunction) => {
    navigateRef = navigate;
};

export const navigate: NavigateFunction = ((to: any, options?: any) => {
    if (navigateRef) {
        navigateRef(to, options);
    }
}) as NavigateFunction;
