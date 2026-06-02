import React from "react";
import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "../../test-utils";
import ProtectedRoute from "./ProtectedRoute";

const Secret: React.FC = () => <div>Secret content</div>;

describe("ProtectedRoute", () => {
    it("renders the protected component when authenticated", () => {
        renderWithProviders(<ProtectedRoute component={Secret} />, {
            preloadedState: {
                auth: { token: "valid-token", error: null, loading: false },
            },
        });

        expect(screen.getByText("Secret content")).toBeInTheDocument();
    });

    it("redirects (does not render the component) when unauthenticated", () => {
        renderWithProviders(<ProtectedRoute component={Secret} />, {
            preloadedState: {
                auth: { token: null, error: null, loading: false },
            },
        });

        expect(screen.queryByText("Secret content")).not.toBeInTheDocument();
    });
});
