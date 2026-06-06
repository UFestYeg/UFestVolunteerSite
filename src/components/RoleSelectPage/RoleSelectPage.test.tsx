import React from "react";
import { describe, it, expect } from "vitest";
import { renderWithProviders, screen, fireEvent } from "../../test-utils";
import RoleSelectPage from "./RoleSelectPage";

describe("RoleSelectPage", () => {
    it("renders the heading and the view toggle", () => {
        renderWithProviders(<RoleSelectPage />);

        expect(
            screen.getByRole("heading", { name: "Request to Volunteer" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "list view" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "calendar view" })
        ).toBeInTheDocument();
    });

    it("defaults to list view and switches to calendar view when toggled", () => {
        renderWithProviders(<RoleSelectPage />);

        const listButton = screen.getByRole("button", { name: "list view" });
        const calendarButton = screen.getByRole("button", {
            name: "calendar view",
        });

        expect(listButton).toHaveAttribute("aria-pressed", "true");
        expect(calendarButton).toHaveAttribute("aria-pressed", "false");

        fireEvent.click(calendarButton);

        expect(calendarButton).toHaveAttribute("aria-pressed", "true");
        expect(listButton).toHaveAttribute("aria-pressed", "false");
    });
});
