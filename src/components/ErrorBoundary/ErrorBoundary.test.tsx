import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderWithProviders, screen } from "../../test-utils";
import { ErrorBoundary } from "./index";

const Boom = () => {
    throw new Error("Boom – testing ErrorBoundary");
};

describe("ErrorBoundary", () => {
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        // React logs the caught error to console.error; silence it for clean output.
        consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it("renders children when no error is thrown", () => {
        renderWithProviders(
            <ErrorBoundary>
                <div>All good</div>
            </ErrorBoundary>
        );

        expect(screen.getByText("All good")).toBeInTheDocument();
    });

    it("renders the fallback UI when a child throws", () => {
        renderWithProviders(
            <ErrorBoundary>
                <Boom />
            </ErrorBoundary>
        );

        expect(
            screen.getByRole("heading", { name: "Something went wrong." })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Reload" })
        ).toBeInTheDocument();
    });
});
