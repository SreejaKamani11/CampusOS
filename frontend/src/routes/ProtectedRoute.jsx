import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function ProtectedRoute({
  children,
  requiredRole,
}) {
  const { accessToken, user } = useAuth();

  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  if (
    requiredRole &&
    user?.role !== requiredRole
  ) {
    toast.error("Access Denied");

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;