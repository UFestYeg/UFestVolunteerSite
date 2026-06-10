import { Button, Container, Typography } from "@mui/material";
import React from "react";
import { logDevError } from "../../store/actions/apiUtils";

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        logDevError("Uncaught error in component tree", error, info);
    }

    handleReload = () => {
        this.setState({ hasError: false });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <Container
                    maxWidth="sm"
                    style={{ textAlign: "center", marginTop: "40px" }}
                >
                    <Typography variant="h3" gutterBottom>
                        Something went wrong.
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        An unexpected error occurred. Please try reloading the
                        page.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleReload}
                    >
                        Reload
                    </Button>
                </Container>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
