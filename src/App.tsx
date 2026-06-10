import { CssBaseline } from "@mui/material";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import React, { useEffect } from "react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import "./App.css";
import { setNavigator } from "./navigation";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { BaseRouter } from "./routes";
import { auth as actions } from "./store/actions";
import { StateHooks } from "./store/hooks";
import { theme } from "./styles";


const NavigationSetter: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        setNavigator(navigate);
    }, [navigate]);
    return null;
};

const App: React.FC = () => {
    const dispatch = StateHooks.useAppDispatch();

    useEffect(() => {
        dispatch(actions.authCheckState());
    }, [dispatch]);
    return (
        <div className="App">
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <SnackbarProvider
                        maxSnack={3}
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        autoHideDuration={5000}
                    >
                        <BrowserRouter>
                            <NavigationSetter />
                            <ErrorBoundary>
                                <BaseRouter />
                            </ErrorBoundary>
                        </BrowserRouter>
                    </SnackbarProvider>
                </ThemeProvider>
            </StyledEngineProvider>
        </div>
    );
};

export default App;
