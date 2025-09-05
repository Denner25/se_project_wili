import { Navigate } from "react-router-dom";

function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return null; // or spinner while checking
  }
  return isLoggedIn ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute;
