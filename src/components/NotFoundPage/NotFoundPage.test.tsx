import React from "react";
import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "../../test-utils";
import NotFoundPage from "./NotFoundPage";

describe("NotFoundPage", () => {
    it("renders the not found message and image", () => {
        renderWithProviders(<NotFoundPage />);

        expect(
            screen.getByText("Looks like that page doesn't exist...")
        ).toBeInTheDocument();
        expect(
            screen.getByRole("img", { name: "Ukrainian Dancing" })
        ).toBeInTheDocument();
    });

    it("links unauthenticated users to the landing page", () => {
        renderWithProviders(<NotFoundPage />, {
            preloadedState: { auth: { token: null, error: null, loading: false } },
        });

        const link = screen.getByRole("link", { name: "Go to Home" });
        expect(link).toHaveAttribute("href", "/");
    });

    it("links authenticated users to the volunteer page", () => {
        renderWithProviders(<NotFoundPage />, {
            preloadedState: { auth: { token: "abc", error: null, loading: false } },
        });

        const link = screen.getByRole("link", { name: "Go to Home" });
        expect(link).toHaveAttribute("href", "/volunteer");
    });
});
