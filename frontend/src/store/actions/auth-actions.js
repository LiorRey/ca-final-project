import {
  SIGNUP,
  LOGIN,
  LOGOUT,
  RESTORE_SESSION,
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

export async function restoreSession() {
  try {
    store.dispatch({ type: RESTORE_SESSION.REQUEST, key: RESTORE_SESSION.KEY });
    const user = await authService.getSession();
    store.dispatch({ type: RESTORE_SESSION.SUCCESS, payload: user });
    return user;
  } catch (error) {
    store.dispatch({
      type: RESTORE_SESSION.FAILURE,
      payload: error.message,
      key: RESTORE_SESSION.KEY,
    });
    // Don't throw error - if there's no session, that's fine
    return null;
  }
}
