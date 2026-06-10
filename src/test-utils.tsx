// Shared testing utilities: a custom render that wraps components in all the
// providers the app relies on (Redux store, MUI theme, router, cookies,
// notistack). Import { renderWithProviders } from this module in component
// tests instead of @testing-library/react's bare `render`.
import { CssBaseline } from "@mui/material";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { render, RenderOptions } from "@testing-library/react";
import { SnackbarProvider } from "notistack";
import React, { PropsWithChildren, ReactElement } from "react";
import { CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import {
    AnyAction,
    applyMiddleware,
    combineReducers,
    createStore,
    Store,
} from "redux";
import { thunk } from "redux-thunk";
import { authReducer, userReducer, volunteerReducer } from "./store/reducers";
import { State } from "./store/types";
import { theme } from "./styles";

export const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    volunteer: volunteerReducer,
});

export const makeTestStore = (
    preloadedState?: Partial<State>
): Store<State, AnyAction> =>
    createStore(
        rootReducer,
        preloadedState as State | undefined,
        applyMiddleware(thunk)
    ) as Store<State, AnyAction>;

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
    preloadedState?: Partial<State>;
    store?: Store<State, AnyAction>;
    route?: string;
    initialEntries?: string[];
}

export function renderWithProviders(
    ui: ReactElement,
    {
        preloadedState,
        store = makeTestStore(preloadedState),
        route = "/",
        initialEntries,
        ...renderOptions
    }: ExtendedRenderOptions = {}
) {
    const Wrapper: React.FC<PropsWithChildren> = ({ children }) => (
        <Provider store={store}>
            <CookiesProvider>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <SnackbarProvider>
                            <MemoryRouter
                                initialEntries={initialEntries ?? [route]}
                            >
                                {children}
                            </MemoryRouter>
                        </SnackbarProvider>
                    </ThemeProvider>
                </StyledEngineProvider>
            </CookiesProvider>
        </Provider>
    );

    return {
        store,
        ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    };
}

// Re-export everything from RTL so tests can import from a single module.
export * from "@testing-library/react";
