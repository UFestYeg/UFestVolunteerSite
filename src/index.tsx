// tslint:disable: no-submodule-imports
import React from "react";
import { CookiesProvider } from "react-cookie";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { thunk } from "redux-thunk";
import App from "./App";
import { Loading } from "./components/Loading";
import * as serviceWorker from "./serviceWorker";
import { authReducer, userReducer, volunteerReducer } from "./store/reducers";
import { sessionExpired } from "./store/actions/auth";
import { registerUnauthorizedInterceptor } from "./store/actions/apiUtils";
import { navigate } from "./navigation";

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const composeEnhancers =
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ as typeof compose) || compose;

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    volunteer: volunteerReducer,
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth", "user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(thunk))
);

const persistor = persistStore(store);

// Fail closed on auth errors: if the backend rejects our token (401), drop the
// stale credentials and send the user to the login page instead of leaving the
// app stuck in a "logged in locally, rejected by the server" state. Uses the
// local-only `sessionExpired` (no network logout) so a dead token can't loop.
registerUnauthorizedInterceptor(() => {
    store.dispatch(sessionExpired());
    navigate("/login");
});

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <CookiesProvider>
                <PersistGate loading={<Loading />} persistor={persistor}>
                    <App />
                </PersistGate>
            </CookiesProvider>
        </Provider>
    </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
