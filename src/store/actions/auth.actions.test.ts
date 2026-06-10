import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import axios from "axios";
import {
    authFail,
    authLogin,
    authStart,
    authSuccess,
    authCheckState,
    changePasswordFail,
    changePasswordStart,
    changePasswordSuccess,
    logout,
    resetPasswordFail,
    resetPasswordStart,
    resetPasswordSuccess,
    sessionExpired,
} from "./auth";
import * as actionTypes from "./actionTypes";
import { AuthUrls } from "../../constants";

vi.mock("axios", () => ({
    default: {
        defaults: { headers: { common: {} as Record<string, string> } },
        post: vi.fn(),
    },
}));

const mockedPost = axios.post as unknown as Mock;

describe("synchronous auth action creators", () => {
    it("authStart returns an AUTH_START action", () => {
        expect(authStart()).toEqual({ type: actionTypes.AUTH_START });
    });

    it("authSuccess returns an AUTH_SUCCESS action carrying the token", () => {
        expect(authSuccess("tok123")).toEqual({
            type: actionTypes.AUTH_SUCCESS,
            token: "tok123",
        });
    });

    it("authFail returns an AUTH_FAIL action carrying the error", () => {
        const error = { message: "bad creds" };
        expect(authFail(error)).toEqual({
            type: actionTypes.AUTH_FAIL,
            error,
        });
    });

    it("resetPasswordStart / resetPasswordSuccess return the right types", () => {
        expect(resetPasswordStart()).toEqual({
            type: actionTypes.RESET_PASSWORD_START,
        });
        expect(resetPasswordSuccess()).toEqual({
            type: actionTypes.RESET_PASSWORD_SUCCESS,
        });
    });

    it("resetPasswordFail carries the error", () => {
        const error = { detail: "expired" };
        expect(resetPasswordFail(error)).toEqual({
            type: actionTypes.RESET_PASSWORD_FAIL,
            error,
        });
    });

    it("changePasswordStart / Success / Fail return the right actions", () => {
        expect(changePasswordStart()).toEqual({
            type: actionTypes.CHANGE_PASSWORD_START,
        });
        expect(changePasswordSuccess()).toEqual({
            type: actionTypes.CHANGE_PASSWORD_SUCCESS,
        });
        const error = { message: "mismatch" };
        expect(changePasswordFail(error)).toEqual({
            type: actionTypes.CHANGE_PASSWORD_FAIL,
            error,
        });
    });
});

describe("logout action creator", () => {
    beforeEach(() => {
        localStorage.clear();
        mockedPost.mockReset();
        mockedPost.mockResolvedValue({});
    });

    it("clears stored credentials and returns an AUTH_LOGOUT action", () => {
        localStorage.setItem("token", "abc");
        localStorage.setItem("expirationDate", "2099-01-01T00:00:00.000Z");

        const action = logout();

        expect(action).toEqual({ type: actionTypes.AUTH_LOGOUT });
        expect(localStorage.getItem("token")).toBeNull();
        expect(localStorage.getItem("expirationDate")).toBeNull();
    });

    it("revokes the token server-side when a token exists", () => {
        localStorage.setItem("token", "abc");

        logout();

        expect(mockedPost).toHaveBeenCalledWith(AuthUrls.LOGOUT, {});
    });

    it("does not call the backend when there is no token", () => {
        logout();

        expect(mockedPost).not.toHaveBeenCalled();
    });
});

describe("sessionExpired action creator", () => {
    beforeEach(() => {
        localStorage.clear();
        mockedPost.mockReset();
        mockedPost.mockResolvedValue({});
    });

    it("clears credentials and returns AUTH_LOGOUT without a network call", () => {
        localStorage.setItem("token", "abc");
        localStorage.setItem("expirationDate", "2099-01-01T00:00:00.000Z");

        const action = sessionExpired();

        expect(action).toEqual({ type: actionTypes.AUTH_LOGOUT });
        expect(localStorage.getItem("token")).toBeNull();
        expect(localStorage.getItem("expirationDate")).toBeNull();
        expect(mockedPost).not.toHaveBeenCalled();
    });
});

describe("authCheckState thunk", () => {
    beforeEach(() => {
        localStorage.clear();
        mockedPost.mockReset();
        mockedPost.mockResolvedValue({});
    });

    it("dispatches logout when there is no token in storage", () => {
        const dispatch = vi.fn();

        authCheckState()(dispatch);

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith({
            type: actionTypes.AUTH_LOGOUT,
        });
    });

    it("dispatches logout when the token has expired", () => {
        localStorage.setItem("token", "abc");
        localStorage.setItem("expirationDate", "2000-01-01T00:00:00.000Z");
        const dispatch = vi.fn();

        authCheckState()(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: actionTypes.AUTH_LOGOUT,
        });
    });

    it("dispatches authSuccess when a valid, unexpired token exists", () => {
        const future = new Date(Date.now() + 60 * 60 * 1000).toISOString();
        localStorage.setItem("token", "valid-token");
        localStorage.setItem("expirationDate", future);
        const dispatch = vi.fn();

        authCheckState()(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: actionTypes.AUTH_SUCCESS,
            token: "valid-token",
        });
    });
});

describe("authLogin thunk", () => {
    beforeEach(() => {
        localStorage.clear();
        mockedPost.mockReset();
    });

    it("dispatches authStart immediately", () => {
        mockedPost.mockResolvedValue({ data: { key: "tok" } });
        const dispatch = vi.fn();

        authLogin("user", "pass", "csrf")(dispatch);

        expect(dispatch).toHaveBeenCalledWith({
            type: actionTypes.AUTH_START,
        });
    });

    it("stores the token and dispatches authSuccess on success", async () => {
        mockedPost.mockResolvedValue({ data: { key: "server-token" } });
        const dispatch = vi.fn();

        authLogin("user", "pass", "csrf")(dispatch);

        await vi.waitFor(() => {
            expect(dispatch).toHaveBeenCalledWith({
                type: actionTypes.AUTH_SUCCESS,
                token: "server-token",
            });
        });
        expect(localStorage.getItem("token")).toBe("server-token");
        expect(localStorage.getItem("expirationDate")).not.toBeNull();
        expect(mockedPost).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({ username: "user", password: "pass" })
        );
    });

    it("dispatches authFail when the request rejects", async () => {
        const error = new Error("401");
        mockedPost.mockRejectedValue(error);
        const dispatch = vi.fn();

        authLogin("user", "pass", "csrf")(dispatch);

        await vi.waitFor(() => {
            expect(dispatch).toHaveBeenCalledWith({
                type: actionTypes.AUTH_FAIL,
                error,
            });
        });
    });
});
