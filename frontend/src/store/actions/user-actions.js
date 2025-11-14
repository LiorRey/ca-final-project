import {
  SET_USERS,
  SET_USER,
  SET_WATCHED_USER,
  DELETE_USER,
  SET_LOADING,
  SET_ERROR,
} from "../reducers/user-reducer";

import { store } from "../store";
import { userService } from "../../services/user";
import { socketService } from "../../services/socket-service";

export async function loadUsers() {
  try {
    store.dispatch(setLoading(true));
    const users = await userService.getUsers();
    store.dispatch(setUsers(users));
  } catch (error) {
    store.dispatch(setError(`Error loading users: ${error.message}`));
  } finally {
    store.dispatch(setLoading(false));
  }
}

export async function deleteUser(userId) {
  try {
    await userService.remove(userId);
    store.dispatch(deleteUserAction(userId));
  } catch (error) {
    store.dispatch(setError(`Error deleting user: ${error.message}`));
    throw error;
  }
}

export async function login(credentials) {
  try {
    const user = await userService.login(credentials);
    store.dispatch(setUser(user));
    socketService.login(user._id);
    return user;
  } catch (error) {
    store.dispatch(setError(`Error logging in: ${error.message}`));
    throw error;
  }
}

export async function signup(credentials) {
  try {
    const user = await userService.signup(credentials);
    store.dispatch(setUser(user));
    socketService.login(user._id);
    return user;
  } catch (error) {
    store.dispatch(setError(`Error signing up: ${error.message}`));
    throw error;
  }
}

export async function logout() {
  try {
    await userService.logout();
    store.dispatch(setUser(null));
    socketService.logout();
  } catch (error) {
    store.dispatch(setError(`Error logging out: ${error.message}`));
    throw error;
  }
}

export async function loadUser(userId) {
  try {
    store.dispatch(setLoading(true));
    const user = await userService.getById(userId);
    store.dispatch(setWatchedUser(user));
  } catch (error) {
    store.dispatch(setError(`Error loading user: ${error.message}`));
  } finally {
    store.dispatch(setLoading(false));
  }
}

function setUsers(users) {
  return { type: SET_USERS, payload: users };
}

function setUser(user) {
  return { type: SET_USER, payload: user };
}

function setWatchedUser(user) {
  return { type: SET_WATCHED_USER, payload: user };
}

function deleteUserAction(userId) {
  return { type: DELETE_USER, payload: userId };
}

function setLoading(isLoading) {
  return { type: SET_LOADING, payload: isLoading };
}

function setError(error) {
  return { type: SET_ERROR, payload: error };
}
