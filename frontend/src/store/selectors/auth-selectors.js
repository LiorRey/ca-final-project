import { VALIDATE_SESSION } from "../reducers/auth-reducer";

export const selectCurrentUser = state => state.auth.currentUser;

export const selectIsAuthenticated = state => !!state.auth.currentUser;

export const selectAuthLoading = state =>
  state.auth.loading[VALIDATE_SESSION.KEY];

export const selectAuthError = state => state.auth.errors[VALIDATE_SESSION.KEY];
