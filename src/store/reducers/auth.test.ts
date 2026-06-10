import { describe, expect, it } from "vitest";
import { reducer } from "./auth";
import * as actionTypes from "../actions/actionTypes";

const initialState = { error: null, loading: false, token: null };

describe("auth reducer", () => {
    it("returns the initial state by default", () => {
        expect(reducer(undefined, { type: "@@INIT" })).toEqual(initialState);
    });

    it("sets loading on AUTH_START", () => {
        const state = reducer(initialState, { type: actionTypes.AUTH_START });
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it("stores the token and clears loading on AUTH_SUCCESS", () => {
        const state = reducer(
            { ...initialState, loading: true },
            { type: actionTypes.AUTH_SUCCESS, token: "abc123" }
        );
        expect(state.token).toBe("abc123");
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
    });

    it("stores the error on AUTH_FAIL", () => {
        const error = { message: "bad" };
        const state = reducer(
            { ...initialState, loading: true },
            { type: actionTypes.AUTH_FAIL, error }
        );
        expect(state.error).toBe(error);
        expect(state.loading).toBe(false);
    });

    it("clears the token on AUTH_LOGOUT", () => {
        const state = reducer(
            { ...initialState, token: "abc123" },
            { type: actionTypes.AUTH_LOGOUT }
        );
        expect(state.token).toBeNull();
    });

    it("sets loading on RESET_PASSWORD_START and clears it on success", () => {
        const loadingState = reducer(initialState, {
            type: actionTypes.RESET_PASSWORD_START,
        });
        expect(loadingState.loading).toBe(true);
        const doneState = reducer(loadingState, {
            type: actionTypes.RESET_PASSWORD_SUCCESS,
        });
        expect(doneState.loading).toBe(false);
    });

    it("sets loading on CHANGE_PASSWORD_START and records errors on fail", () => {
        const loadingState = reducer(initialState, {
            type: actionTypes.CHANGE_PASSWORD_START,
        });
        expect(loadingState.loading).toBe(true);
        const failState = reducer(loadingState, {
            type: actionTypes.CHANGE_PASSWORD_FAIL,
            error: "nope",
        });
        expect(failState.error).toBe("nope");
        expect(failState.loading).toBe(false);
    });
});
