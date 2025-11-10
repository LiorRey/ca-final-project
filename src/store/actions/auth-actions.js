import { SIGNUP } from "../reducers/auth-reducer";
import { authService } from "../../services/auth";

import { store } from "../store";

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
