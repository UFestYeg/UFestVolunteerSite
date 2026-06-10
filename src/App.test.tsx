import React from "react";
import { CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";
import { makeTestStore } from "./test-utils";

describe("App", () => {
    it("renders without crashing", () => {
        const store = makeTestStore();
        const { container } = render(
            <Provider store={store}>
                <CookiesProvider>
                    <App />
                </CookiesProvider>
            </Provider>
        );
        expect(container.querySelector(".App")).toBeInTheDocument();
    });
});
