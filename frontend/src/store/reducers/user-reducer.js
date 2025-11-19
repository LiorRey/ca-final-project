import { userService } from "../../services/user";

export const SET_USERS = "SET_USERS";
export const SET_USER = "SET_USER";
export const SET_WATCHED_USER = "SET_WATCHED_USER";
export const DELETE_USER = "DELETE_USER";
export const SET_LOADING = "users/SET_LOADING";
export const SET_ERROR = "users/SET_ERROR";

const initialState = {
  users: [],
  currentUser: userService.getLoggedinUser(),
  watchedUser: null,
  isLoading: false,
  error: null,
};

export function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USERS:
      return { ...state, users: action.payload };
    case SET_USER:
      return { ...state, currentUser: action.payload };
    case SET_WATCHED_USER:
      return { ...state, watchedUser: action.payload };
    case DELETE_USER:
      const users = state.users.filter(user => user._id !== action.payload);
      return { ...state, users };
    case SET_LOADING:
      return { ...state, isLoading: action.payload };
    case SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}
