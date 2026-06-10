import { enqueueSnackbar } from "notistack";
import axios from "axios";

// Apply the auth/CSRF headers used by every authenticated request to the
// shared axios defaults. Centralizing this avoids repeating the same three
// header assignments at every call site. When a value is missing we delete the
// corresponding header instead of sending a bogus one (e.g. "Authorization:
// Token null"), so it's always clear whether a request is actually
// authenticated.
export const setAuthHeaders = (
    token: string | null,
    csrftoken?: string
): void => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Token ${token}`;
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
    axios.defaults.headers.common["Content-Type"] = "application/json";
    if (csrftoken) {
        axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
    } else {
        delete axios.defaults.headers.common["X-CSRFToken"];
    }
};

// Register a global response interceptor that fails closed on authentication
// errors. When the backend rejects our DRF token (HTTP 401), the locally
// cached token is stale/revoked, so any further requests with it will keep
// failing. Rather than leave the app in a "logged in locally but rejected by
// the server" limbo, we invoke `onUnauthorized` (which clears the credentials
// and redirects to login). The 401 is still rejected so individual callers can
// run their own error handling too. Returns the interceptor id so tests/HMR
// can eject it.
export const registerUnauthorizedInterceptor = (
    onUnauthorized: () => void
): number => {
    return axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error?.response?.status === 401) {
                onUnauthorized();
            }
            return Promise.reject(error);
        }
    );
};

// Only emit console output during local development. Vite replaces
// import.meta.env.DEV with a boolean at build time, so production bundles
// drop these calls entirely.
export const logDev = (...args: unknown[]): void => {
    if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log(...args);
    }
};

export const logDevError = (...args: unknown[]): void => {
    if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error(...args);
    }
};

// Extract a human-readable message from an axios error's response body. DRF
// typically returns either {detail: "..."} or {field: ["msg", ...]}.
const extractResponseMessage = (data: unknown): string | null => {
    if (!data) {
        return null;
    }
    if (typeof data === "string") {
        return data;
    }
    if (typeof data === "object") {
        const record = data as Record<string, unknown>;
        if (typeof record.detail === "string") {
            return record.detail;
        }
        const parts: string[] = [];
        Object.values(record).forEach((value) => {
            if (Array.isArray(value)) {
                parts.push(value.map(String).join(" "));
            } else if (typeof value === "string") {
                parts.push(value);
            }
        });
        if (parts.length > 0) {
            return parts.join(" ");
        }
    }
    return null;
};

// Show an error notification to the user and log details in development.
export const notifyApiError = (error: any, fallbackMessage: string): void => {
    logDevError(error);
    const message =
        extractResponseMessage(error?.response?.data) ?? fallbackMessage;
    enqueueSnackbar(message, { variant: "error" });
};
