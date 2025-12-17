import { createAsyncActionTypes, createAsyncHandlers } from "../utils";

export const SIGNUP = createAsyncActionTypes("SIGNUP");
export const LOGIN = createAsyncActionTypes("LOGIN");
export const LOGOUT = createAsyncActionTypes("LOGOUT");
export const RESTORE_SESSION = createAsyncActionTypes("RESTORE_SESSION");

const initialState = {
  currentUser: null,
  loading: {},
  errors: {},
};

const handlers = {
  ...createAsyncHandlers(SIGNUP, SIGNUP.KEY),
  [SIGNUP.SUCCESS]: (state, action) => ({
    ...state,
    loading: { ...state.loading, [SIGNUP.KEY]: false },
    currentUser: action.payload,
  }),
  ...createAsyncHandlers(LOGIN, LOGIN.KEY),
  [LOGIN.SUCCESS]: (state, action) => ({
    ...state,
    loading: { ...state.loading, [LOGIN.KEY]: false },
    currentUser: action.payload,
  }),
  ...createAsyncHandlers(LOGOUT, LOGOUT.KEY),
  [LOGOUT.SUCCESS]: state => ({
    ...state,
    loading: { ...state.loading, [LOGOUT.KEY]: false },
    currentUser: null,
  }),
  ...createAsyncHandlers(RESTORE_SESSION, RESTORE_SESSION.KEY),
  [RESTORE_SESSION.SUCCESS]: (state, action) => ({
    ...state,
    loading: { ...state.loading, [RESTORE_SESSION.KEY]: false },
    currentUser: action.payload,
  }),
};

export function authReducer(state = initialState, action) {
  const handler = handlers[action.type];
  return handler ? handler(state, action) : state;
}
