import React from "react";
import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "../../test-utils";
import Loading from "./Loading";

describe("Loading", () => {
    it("renders the loading heading and spinner image", () => {
        renderWithProviders(<Loading />);

        expect(
            screen.getByRole("heading", { name: "Loading..." })
        ).toBeInTheDocument();

        const img = screen.getByRole("img", { name: "Loading" });
        expect(img).toBeInTheDocument();
    });
});
