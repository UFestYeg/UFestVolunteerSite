import React from "react";
import { describe, it, expect } from "vitest";
import { renderWithProviders, screen, fireEvent, within } from "../../test-utils";
import RoleSelectPage from "./RoleSelectPage";

describe("RoleSelectPage", () => {
    it("renders the heading and the View select label", () => {
        renderWithProviders(<RoleSelectPage />);

        expect(
            screen.getByRole("heading", { name: "Request to Volunteer" })
        ).toBeInTheDocument();
        expect(screen.getByLabelText("View")).toBeInTheDocument();
    });

    it("shows both view options when the select is opened", () => {
        renderWithProviders(<RoleSelectPage />);

        fireEvent.mouseDown(screen.getByRole("combobox", { name: "View" }));

        const listbox = within(screen.getByRole("listbox"));
        expect(
            listbox.getByRole("option", { name: "List View" })
        ).toBeInTheDocument();
        expect(
            listbox.getByRole("option", { name: "Calendar View" })
        ).toBeInTheDocument();
    });
});
