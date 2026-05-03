import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp || decoded.exp < Date.now() / 1000) {
      localStorage.removeItem("token");
      return <Navigate to="/" replace />;
    }
  } catch {
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }

  return children;
}
