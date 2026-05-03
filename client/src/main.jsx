import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { RefreshProvider } from "./context/RefreshContext";
import ErrorBoundary from "./components/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <RefreshProvider>
          <App />
        </RefreshProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
