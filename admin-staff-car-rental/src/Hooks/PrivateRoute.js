import { useAuth } from "./AuthProvider";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
const PrivateRoute = () => {
  const { isAuthenticated, isAdminOrStaff } = useAuth();

  return isAuthenticated && isAdminOrStaff() ? (
    <Outlet />
  ) : (
    <Navigate to="/admin-login" />
  );
};

export default PrivateRoute;
