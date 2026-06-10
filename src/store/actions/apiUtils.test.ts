import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import {
    notifyApiError,
    registerUnauthorizedInterceptor,
    setAuthHeaders,
} from "./apiUtils";

vi.mock("notistack", () => ({
    enqueueSnackbar: vi.fn(),
}));

vi.mock("axios", () => ({
    default: {
        defaults: { headers: { common: {} as Record<string, string> } },
        interceptors: {
            response: { use: vi.fn(() => 7) },
        },
    },
}));

const mockedEnqueue = enqueueSnackbar as unknown as Mock;
const mockedUse = (axios as unknown as {
    interceptors: { response: { use: Mock } };
}).interceptors.response.use;

describe("setAuthHeaders", () => {
    beforeEach(() => {
        axios.defaults.headers.common = {} as Record<string, string>;
    });

    it("sets the DRF token, content type and CSRF header", () => {
        setAuthHeaders("tok123", "csrf456");

        expect(axios.defaults.headers.common["Authorization"]).toBe(
            "Token tok123"
        );
        expect(axios.defaults.headers.common["Content-Type"]).toBe(
            "application/json"
        );
        expect(axios.defaults.headers.common["X-CSRFToken"]).toBe("csrf456");
    });

    it("removes the auth and CSRF headers when the token is null", () => {
        axios.defaults.headers.common["Authorization"] = "Token stale";
        axios.defaults.headers.common["X-CSRFToken"] = "old-csrf";

        setAuthHeaders(null);

        expect(
            axios.defaults.headers.common["Authorization"]
        ).toBeUndefined();
        expect(axios.defaults.headers.common["Content-Type"]).toBe(
            "application/json"
        );
        expect(axios.defaults.headers.common["X-CSRFToken"]).toBeUndefined();
    });
});

describe("notifyApiError", () => {
    beforeEach(() => {
        mockedEnqueue.mockReset();
    });

    it("uses the DRF `detail` string when present", () => {
        notifyApiError(
            { response: { data: { detail: "Not allowed" } } },
            "fallback"
        );

        expect(mockedEnqueue).toHaveBeenCalledWith("Not allowed", {
            variant: "error",
        });
    });

    it("joins field-level validation arrays into one message", () => {
        notifyApiError(
            {
                response: {
                    data: {
                        email: ["This field is required.", "Invalid."],
                        password: ["Too short."],
                    },
                },
            },
            "fallback"
        );

        expect(mockedEnqueue).toHaveBeenCalledWith(
            "This field is required. Invalid. Too short.",
            { variant: "error" }
        );
    });

    it("uses a plain string response body directly", () => {
        notifyApiError({ response: { data: "Server exploded" } }, "fallback");

        expect(mockedEnqueue).toHaveBeenCalledWith("Server exploded", {
            variant: "error",
        });
    });

    it("falls back to the provided message when there is no response body", () => {
        notifyApiError(new Error("network down"), "Could not load data.");

        expect(mockedEnqueue).toHaveBeenCalledWith("Could not load data.", {
            variant: "error",
        });
    });

    it("falls back when the response data has no usable fields", () => {
        notifyApiError(
            { response: { data: { count: 3, nested: { a: 1 } } } },
            "Fallback here."
        );

        expect(mockedEnqueue).toHaveBeenCalledWith("Fallback here.", {
            variant: "error",
        });
    });
});

describe("registerUnauthorizedInterceptor", () => {
    beforeEach(() => {
        mockedUse.mockClear();
    });

    it("registers a response interceptor and returns its id", () => {
        const onUnauthorized = vi.fn();

        const id = registerUnauthorizedInterceptor(onUnauthorized);

        expect(id).toBe(7);
        expect(mockedUse).toHaveBeenCalledTimes(1);
    });

    it("invokes onUnauthorized and rejects on a 401 response", async () => {
        const onUnauthorized = vi.fn();
        registerUnauthorizedInterceptor(onUnauthorized);

        const rejected = mockedUse.mock.calls[0][1] as (
            error: unknown
        ) => Promise<unknown>;

        await expect(
            rejected({ response: { status: 401 } })
        ).rejects.toEqual({ response: { status: 401 } });
        expect(onUnauthorized).toHaveBeenCalledTimes(1);
    });

    it("does not call onUnauthorized for non-401 errors", async () => {
        const onUnauthorized = vi.fn();
        registerUnauthorizedInterceptor(onUnauthorized);

        const rejected = mockedUse.mock.calls[0][1] as (
            error: unknown
        ) => Promise<unknown>;

        await expect(
            rejected({ response: { status: 500 } })
        ).rejects.toEqual({ response: { status: 500 } });
        expect(onUnauthorized).not.toHaveBeenCalled();
    });
});
