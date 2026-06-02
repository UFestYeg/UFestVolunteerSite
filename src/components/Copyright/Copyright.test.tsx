import React from "react";
import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "../../test-utils";
import Copyright from "./Copyright";

describe("Copyright", () => {
    it("renders the copyright text with the current year and UFest link", () => {
        renderWithProviders(<Copyright />);

        const year = new Date().getFullYear();
        expect(
            screen.getByText(
                (_content, element) =>
                    element?.tagName === "P" &&
                    element?.textContent ===
                        `Copyright © UFest Edmonton ${year}.`
            )
        ).toBeInTheDocument();

        const link = screen.getByRole("link", { name: "UFest Edmonton" });
        expect(link).toHaveAttribute("href", "https://ufest.ca/");
    });
});
