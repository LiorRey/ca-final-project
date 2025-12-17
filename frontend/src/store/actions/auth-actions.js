import {
  SIGNUP,
  LOGIN,
  LOGOUT,
  VALIDATE_SESSION,
} from "../reducers/auth-reducer";
import { authService } from "../../services/auth";
import { userService } from "../../services/user/user-service-remote";

import { store } from "../store";
import { createAsyncAction } from "../utils";

export async function signup(userData) {
  try {
    store.dispatch({ type: SIGNUP.REQUEST, key: SIGNUP.KEY });
    const user = await authService.signup(userData);
    store.dispatch({ type: SIGNUP.SUCCESS, payload: user });
    return user;
  } catch (error) {
    store.dispatch({
      type: SIGNUP.FAILURE,
      payload: error.message,
      key: SIGNUP.KEY,
    });
    throw error;
  }
}

export async function login(credentials) {
  try {
    store.dispatch({ type: LOGIN.REQUEST, key: LOGIN.KEY });
    const user = await authService.login(credentials);
    store.dispatch({ type: LOGIN.SUCCESS, payload: user });
    return user;
  } catch (error) {
    store.dispatch({
      type: LOGIN.FAILURE,
      payload: error.message,
      key: LOGIN.KEY,
    });
    throw error;
  }
}

export const logout = createAsyncAction(LOGOUT, userService.logout, store);

export const validateSession = createAsyncAction(
  VALIDATE_SESSION,
  authService.getSession,
  store
);
