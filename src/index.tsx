// tslint:disable: no-submodule-imports
import React from "react";
import { CookiesProvider } from "react-cookie";
import ReactDOM from "react-dom";
import { reducer as notifications } from "react-notification-system-redux";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import thunk from "redux-thunk";
import App from "./App";
import { Loading } from "./components/Loading";
import * as serviceWorker from "./serviceWorker";
import { authReducer, userReducer, volunteerReducer } from "./store/reducers";

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
    notifications,
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth", "user", "notifications"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(thunk))
);

const persistor = persistStore(store);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <CookiesProvider>
                <PersistGate loading={<Loading />} persistor={persistor}>
                    <App />
                </PersistGate>
            </CookiesProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
