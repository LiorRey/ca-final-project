import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { CircularProgress, Box } from "@mui/material";
import { validateSession } from "../store/actions/auth-actions";
import {
  selectIsAuthenticated,
  selectAuthLoading,
} from "../store/selectors/auth-selectors";

export const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      await validateSession();
      setInitialized(true);
    })();
  }, []);

  if (loading || !initialized) {
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
