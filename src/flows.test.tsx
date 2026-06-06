// End-to-end / integration tests for the main customer flows. These render the
// real route tree (`BaseRouter`), the real Redux store, and the real page
// components, with only the network layer (`axios`) mocked. They exercise full
// user journeys — protected-route gating, login, signup, and browsing
// categories — the way a customer would, without standing up the Django
// backend or a browser. Deeper component-level assertions live in the
// per-component test files; these focus on navigation and cross-page wiring.
import React from "react";
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
    type Mock,
} from "vitest";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    fireEvent,
    renderWithProviders,
    screen,
    waitFor,
} from "./test-utils";
import BaseRouter from "./routes/routes";
import { setNavigator } from "./navigation";
import { DefaultUser } from "./store/types";

vi.mock("axios", () => ({
    default: {
        defaults: { headers: { common: {} as Record<string, string> } },
        interceptors: { response: { use: vi.fn() } },
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
    },
}));

const mockedGet = axios.get as unknown as Mock;
const mockedPost = axios.post as unknown as Mock;
const mockedPatch = axios.patch as unknown as Mock;

const profileFixture = {
    ...DefaultUser,
    pk: 1,
    username: "ada",
    first_name: "Ada",
    last_name: "Lovelace",
    email: "ada@example.com",
};

const categoryTypesFixture = [{ id: 5, pk: 5, tag: "Beer Tent" }];

// Resolve GET requests by URL so any page reached during a flow renders with
// sensible data instead of crashing on an undefined response.
const defaultGet = (url: string) => {
    if (url.includes("rest-auth/user")) {
        return Promise.resolve({ data: profileFixture });
    }
    if (url.includes("api/categories")) {
        return Promise.resolve({ data: categoryTypesFixture });
    }
    return Promise.resolve({ data: [] });
};

// Bridges the global `navigate` helper (used by thunks like signup) to the
// in-test MemoryRouter, mirroring `NavigationSetter` from `App`.
const NavWire: React.FC = () => {
    const navigate = useNavigate();
    React.useEffect(() => {
        setNavigator(navigate);
    }, [navigate]);
    return null;
};

const authState = (token: string | null) => ({
    auth: { token, error: null, loading: false },
});

const renderApp = (route: string, token: string | null = null) =>
    renderWithProviders(
        <>
            <NavWire />
            <BaseRouter />
        </>,
        { initialEntries: [route], preloadedState: authState(token) }
    );

beforeEach(() => {
    localStorage.clear();
    mockedGet.mockReset();
    mockedGet.mockImplementation(defaultGet);
    mockedPost.mockReset();
    mockedPost.mockResolvedValue({ data: {} });
    mockedPatch.mockReset();
    mockedPatch.mockResolvedValue({ data: {} });
});

afterEach(() => {
    localStorage.clear();
});

describe("customer flow: protected routes", () => {
    it("redirects an unauthenticated visitor from a protected page to the login page", async () => {
        renderApp("/volunteer", null);

        expect(
            await screen.findByRole("heading", { name: "Sign in" })
        ).toBeInTheDocument();
    });

    it("lets an authenticated volunteer land on the home page", async () => {
        localStorage.setItem("token", "tok");
        renderApp("/volunteer", "tok");

        expect(
            await screen.findByText(
                "Thank you for signing up to volunteer at UFest!"
            )
        ).toBeInTheDocument();
    });
});

describe("customer flow: login", () => {
    it("logs in with valid credentials and lands on the profile edit page", async () => {
        mockedPost.mockImplementation((url: string) => {
            if (url.includes("rest-auth/login")) {
                return Promise.resolve({ data: { key: "test-token" } });
            }
            return Promise.resolve({ data: {} });
        });

        renderApp("/login", null);

        fireEvent.change(screen.getByLabelText(/User Name/), {
            target: { value: "ada" },
        });
        fireEvent.change(screen.getByLabelText(/^Password/), {
            target: { value: "password123" },
        });

        const submit = screen.getByRole("button", { name: "Sign In" });
        await waitFor(() => expect(submit).toBeEnabled());
        fireEvent.click(submit);

        expect(
            await screen.findByRole(
                "heading",
                { name: "Edit Profile" },
                { timeout: 4000 }
            )
        ).toBeInTheDocument();
        expect(localStorage.getItem("token")).toBe("test-token");
    });
});

describe("customer flow: signup", () => {
    it("registers a new volunteer and shows the registration confirmation", async () => {
        mockedPost.mockImplementation((url: string) => {
            if (url.includes("registration")) {
                return Promise.resolve({ data: {} });
            }
            return Promise.resolve({ data: {} });
        });

        renderApp("/signup", null);

        fireEvent.change(screen.getByLabelText(/First Name/), {
            target: { value: "Ada" },
        });
        fireEvent.change(screen.getByLabelText(/Last Name/), {
            target: { value: "Lovelace" },
        });
        fireEvent.change(screen.getByLabelText(/User Name/), {
            target: { value: "ada" },
        });
        fireEvent.change(screen.getByLabelText(/Email Address/), {
            target: { value: "ada@example.com" },
        });
        fireEvent.change(screen.getByLabelText(/^Password/), {
            target: { value: "password123" },
        });
        fireEvent.change(screen.getByLabelText(/Confirm Password/), {
            target: { value: "password123" },
        });

        const submit = screen.getByRole("button", { name: "Sign Up" });
        await waitFor(() => expect(submit).toBeEnabled());
        fireEvent.click(submit);

        expect(
            await screen.findByText(
                /Thanks for your registration/,
                undefined,
                { timeout: 4000 }
            )
        ).toBeInTheDocument();
    });
});

describe("customer flow: browse categories", () => {
    it("shows volunteer categories and navigates into one to request a position", async () => {
        localStorage.setItem("token", "tok");
        renderApp("/volunteer/categories", "tok");

        const categoryCard = await screen.findByText("Beer Tent");
        fireEvent.click(categoryCard);

        // RoleSelectPage (the category's request page) exposes a "View" select
        // that the category list page does not, confirming we navigated in.
        expect(await screen.findByLabelText("View")).toBeInTheDocument();
    });
});
