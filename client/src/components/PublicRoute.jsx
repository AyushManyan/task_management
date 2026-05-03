import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function PublicRoute({ children }) {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp && decoded.exp >= Date.now() / 1000) {
        return <Navigate to="/dashboard" replace />;
      }
    } catch {
      // Token is malformed — treat as unauthenticated
    }
  }

  return children;
}
