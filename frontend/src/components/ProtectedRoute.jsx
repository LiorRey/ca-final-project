import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { CircularProgress, Box } from "@mui/material";
import { validateSession } from "../store/actions/auth-actions";
import {
  selectIsAuthenticated,
  selectAuthLoading,
} from "../store/selectors/auth-selectors";

export const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const hasCheckedSession = useRef(false);

  useEffect(() => {
    // Check session only once when component mounts and user is not authenticated
    if (!isAuthenticated && !loading && !hasCheckedSession.current) {
      hasCheckedSession.current = true;
      validateSession();
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
