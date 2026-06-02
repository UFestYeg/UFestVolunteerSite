import { describe, expect, it } from "vitest";
import { reducer } from "./user";
import * as actionTypes from "../actions/actionTypes";
import { DefaultUser } from "../types";

const initialState = {
    error: null,
    loading: false,
    currentProfile: DefaultUser,
    viewedProfile: DefaultUser,
};

describe("user reducer", () => {
    it("returns the initial state by default", () => {
        expect(reducer(undefined, { type: "@@INIT" })).toEqual(initialState);
    });

    it("sets loading and clears error on USER_GET_PROFILE_START", () => {
        const state = reducer(
            { ...initialState, error: "old" },
            { type: actionTypes.USER_GET_PROFILE_START }
        );
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it("stores the current profile on USER_GET_PROFILE_SUCCESS", () => {
        const payload = { ...DefaultUser, first_name: "Ada" };
        const state = reducer(
            { ...initialState, loading: true },
            { type: actionTypes.USER_GET_PROFILE_SUCCESS, payload }
        );
        expect(state.currentProfile).toBe(payload);
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
    });

    it("stores the viewed profile on USER_GET_VIEWED_PROFILE_SUCCESS", () => {
        const payload = { ...DefaultUser, first_name: "Grace" };
        const state = reducer(
            { ...initialState, loading: true },
            { type: actionTypes.USER_GET_VIEWED_PROFILE_SUCCESS, payload }
        );
        expect(state.viewedProfile).toBe(payload);
        // current profile should remain untouched
        expect(state.currentProfile).toBe(DefaultUser);
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
    });

    it("stores the error on USER_GET_PROFILE_FAIL", () => {
        const error = { message: "nope" };
        const state = reducer(
            { ...initialState, loading: true },
            { type: actionTypes.USER_GET_PROFILE_FAIL, error }
        );
        expect(state.error).toBe(error);
        expect(state.loading).toBe(false);
    });

    it("sets loading on UPDATE_PROFILE_START", () => {
        const state = reducer(
            { ...initialState, error: "old" },
            { type: actionTypes.UPDATE_PROFILE_START }
        );
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it("clears loading and error on UPDATE_PROFILE_SUCCESS", () => {
        const state = reducer(
            { ...initialState, loading: true, error: "old" },
            { type: actionTypes.UPDATE_PROFILE_SUCCESS }
        );
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
    });

    it("stores the error on UPDATE_PROFILE_FAIL", () => {
        const error = { detail: "bad" };
        const state = reducer(
            { ...initialState, loading: true },
            { type: actionTypes.UPDATE_PROFILE_FAIL, error }
        );
        expect(state.error).toBe(error);
        expect(state.loading).toBe(false);
    });

    it("returns the same state for USER_CLEAR_PROFILE (unhandled)", () => {
        const current = { ...initialState, loading: true };
        const state = reducer(current, {
            type: actionTypes.USER_CLEAR_PROFILE,
        });
        expect(state).toBe(current);
    });
});
