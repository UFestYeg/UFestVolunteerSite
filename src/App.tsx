import { CssBaseline } from "@material-ui/core";

import {
    createMuiTheme,
    responsiveFontSizes,
    ThemeProvider,
} from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import BaseRouter from "./routes";
import { auth as actions } from "./store/actions";

const App: React.FC = () => {
    let theme = createMuiTheme();
    theme = responsiveFontSizes(theme);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(actions.authCheckState());
    }, []);
    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                    <BaseRouter />
                </Router>
            </ThemeProvider>
        </div>
    );
};

export default App;
