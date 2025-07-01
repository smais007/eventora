import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { JSX } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();

  const token = localStorage.getItem("token");
  const profile = localStorage.getItem("profile");

  const isAuthenticated = user || (token && profile);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
