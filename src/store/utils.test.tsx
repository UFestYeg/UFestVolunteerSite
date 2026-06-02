import { describe, expect, it } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { buildErrorMessage, updateObject, userAvatarString } from "./utils";
import { IUserProfile } from "./types";

describe("updateObject", () => {
    it("merges updated properties over the old object", () => {
        const result = updateObject(
            { a: 1, b: 2 },
            { b: 3, c: 4 }
        );
        expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it("returns a new object without mutating the original", () => {
        const original = { a: 1 };
        const result = updateObject(original, { a: 2 });
        expect(result).not.toBe(original);
        expect(original).toEqual({ a: 1 });
    });
});

describe("userAvatarString", () => {
    it("returns the initials from first and last name", () => {
        const profile = {
            first_name: "Ada",
            last_name: "Lovelace",
        } as IUserProfile;
        expect(userAvatarString(profile)).toBe("AL");
    });

    it("returns 'User' when the profile has no first name", () => {
        const profile = { first_name: "", last_name: "Lovelace" } as IUserProfile;
        expect(userAvatarString(profile)).toBe("User");
    });

    it("returns 'User' when the profile is null/undefined", () => {
        expect(userAvatarString(null as unknown as IUserProfile)).toBe("User");
        expect(
            userAvatarString(undefined as unknown as IUserProfile)
        ).toBe("User");
    });
});

describe("buildErrorMessage", () => {
    it("builds one Typography per entry in error.response.data", () => {
        const error = {
            response: {
                data: {
                    email: "is invalid",
                    password: "is too short",
                },
            },
        };
        const messages = buildErrorMessage(error);
        expect(messages).toHaveLength(2);

        render(<>{messages}</>);
        expect(
            screen.getByText("email: is invalid")
        ).toBeInTheDocument();
        expect(
            screen.getByText("password: is too short")
        ).toBeInTheDocument();
    });

    it("falls back to error.message when there is no response data", () => {
        const messages = buildErrorMessage({ message: "Network Error" });
        expect(messages).toHaveLength(1);

        render(<>{messages}</>);
        const node = screen.getByText("Network Error");
        expect(node).toBeInTheDocument();
    });

    it("returns an empty array when the error has neither data nor message", () => {
        expect(buildErrorMessage({})).toEqual([]);
        expect(buildErrorMessage(null)).toEqual([]);
        expect(buildErrorMessage(undefined)).toEqual([]);
    });
});
