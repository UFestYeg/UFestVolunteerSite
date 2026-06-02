import { describe, expect, it } from "vitest";
import { reducer } from "./volunteer";
import * as actionTypes from "../actions/actionTypes";

const baseState = {
    categories: [],
    categoryTypes: [],
    mappedRoles: [],
    eventDates: [],
    loading: false,
    error: null,
    eventDatesLoading: false,
};

describe("volunteer reducer", () => {
    it("returns a well-formed initial state by default", () => {
        const state = reducer(undefined, { type: "@@INIT" });
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.eventDatesLoading).toBe(false);
        expect(Array.isArray(state.categories)).toBe(true);
        expect(Array.isArray(state.categoryTypes)).toBe(true);
        expect(Array.isArray(state.mappedRoles)).toBe(true);
        expect(state.eventDates).toEqual([]);
    });

    it("stores category types on GET_VOLUNTEER_CATEGORY_TYPES", () => {
        const payload = [{ id: 1 }, { id: 2 }];
        const state = reducer(baseState, {
            type: actionTypes.GET_VOLUNTEER_CATEGORY_TYPES,
            payload,
        });
        expect(state.categoryTypes).toBe(payload);
    });

    it("sets loading on GET_VOLUNTEER_CATEGORIES_START", () => {
        const state = reducer(
            { ...baseState, error: "old" },
            { type: actionTypes.GET_VOLUNTEER_CATEGORIES_START }
        );
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it("stores categories on GET_VOLUNTEER_CATEGORIES_SUCCESS", () => {
        const payload = [{ id: 5 }];
        const state = reducer(
            { ...baseState, loading: true },
            { type: actionTypes.GET_VOLUNTEER_CATEGORIES_SUCCESS, payload }
        );
        expect(state.categories).toBe(payload);
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
    });

    it("stores the error on GET_VOLUNTEER_CATEGORIES_FAIL", () => {
        const error = { message: "boom" };
        const state = reducer(
            { ...baseState, loading: true },
            { type: actionTypes.GET_VOLUNTEER_CATEGORIES_FAIL, error }
        );
        expect(state.error).toBe(error);
        expect(state.loading).toBe(false);
    });

    it("sets loading on GET_MAPPED_VOLUNTEER_ROLES_START", () => {
        const state = reducer(baseState, {
            type: actionTypes.GET_MAPPED_VOLUNTEER_ROLES_START,
        });
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it("stores mapped roles on GET_MAPPED_VOLUNTEER_ROLES_SUCCESS", () => {
        const payload = [{ id: "a" }];
        const state = reducer(
            { ...baseState, loading: true },
            { type: actionTypes.GET_MAPPED_VOLUNTEER_ROLES_SUCCESS, payload }
        );
        expect(state.mappedRoles).toBe(payload);
        expect(state.loading).toBe(false);
    });

    it("stores the error on GET_MAPPED_VOLUNTEER_ROLES_FAIL", () => {
        const error = { message: "fail" };
        const state = reducer(
            { ...baseState, loading: true },
            { type: actionTypes.GET_MAPPED_VOLUNTEER_ROLES_FAIL, error }
        );
        expect(state.error).toBe(error);
        expect(state.loading).toBe(false);
    });

    it("toggles loading on ACCEPT_REQUEST_START / SUCCESS / FAIL", () => {
        const started = reducer(baseState, {
            type: actionTypes.ACCEPT_REQUEST_START,
        });
        expect(started.loading).toBe(true);
        const success = reducer(started, {
            type: actionTypes.ACCEPT_REQUEST_SUCCESS,
        });
        expect(success.loading).toBe(false);
        expect(success.error).toBeNull();
        const failed = reducer(started, {
            type: actionTypes.ACCEPT_REQUEST_FAIL,
            error: "x",
        });
        expect(failed.error).toBe("x");
        expect(failed.loading).toBe(false);
    });

    it("toggles loading on DENY_REQUEST_START / SUCCESS / FAIL", () => {
        const started = reducer(baseState, {
            type: actionTypes.DENY_REQUEST_START,
        });
        expect(started.loading).toBe(true);
        const success = reducer(started, {
            type: actionTypes.DENY_REQUEST_SUCCESS,
        });
        expect(success.loading).toBe(false);
        const failed = reducer(started, {
            type: actionTypes.DENY_REQUEST_FAIL,
            error: "y",
        });
        expect(failed.error).toBe("y");
        expect(failed.loading).toBe(false);
    });

    it("toggles loading on CHANGE_REQUEST_ROLE_START / SUCCESS / FAIL", () => {
        const started = reducer(baseState, {
            type: actionTypes.CHANGE_REQUEST_ROLE_START,
        });
        expect(started.loading).toBe(true);
        const success = reducer(started, {
            type: actionTypes.CHANGE_REQUEST_ROLE_SUCCESS,
        });
        expect(success.loading).toBe(false);
        const failed = reducer(started, {
            type: actionTypes.CHANGE_REQUEST_ROLE_FAIL,
            error: "z",
        });
        expect(failed.error).toBe("z");
        expect(failed.loading).toBe(false);
    });

    it("stores categories on GET_VOLUNTEER_CATEGORY_OF_TYPE", () => {
        const payload = [{ id: 7 }];
        const state = reducer(baseState, {
            type: actionTypes.GET_VOLUNTEER_CATEGORY_OF_TYPE,
            payload,
        });
        expect(state.categories).toBe(payload);
    });

    it("sets eventDatesLoading on GET_EVENT_DATES_START", () => {
        const state = reducer(
            { ...baseState, error: "old" },
            { type: actionTypes.GET_EVENT_DATES_START }
        );
        expect(state.eventDatesLoading).toBe(true);
        expect(state.error).toBeNull();
        // the generic `loading` flag should be untouched
        expect(state.loading).toBe(false);
    });

    it("stores event dates on GET_EVENT_DATES_SUCCESS", () => {
        const payload = [{ pk: 1, event_date: "2025-05-27", label: "" }];
        const state = reducer(
            { ...baseState, eventDatesLoading: true },
            { type: actionTypes.GET_EVENT_DATES_SUCCESS, payload }
        );
        expect(state.eventDates).toBe(payload);
        expect(state.eventDatesLoading).toBe(false);
        expect(state.error).toBeNull();
    });

    it("stores the error on GET_EVENT_DATES_FAIL", () => {
        const error = { message: "dates failed" };
        const state = reducer(
            { ...baseState, eventDatesLoading: true },
            { type: actionTypes.GET_EVENT_DATES_FAIL, error }
        );
        expect(state.error).toBe(error);
        expect(state.eventDatesLoading).toBe(false);
    });

    it("returns the same state for an unknown action", () => {
        const state = reducer(baseState, { type: "SOMETHING_ELSE" });
        expect(state).toBe(baseState);
    });
});
