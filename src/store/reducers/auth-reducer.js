import { createAsyncActionTypes, createAsyncHandlers } from "../utils";

export const SIGNUP = createAsyncActionTypes("SIGNUP");

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
};

export function authReducer(state = initialState, action) {
  const handler = handlers[action.type];
  return handler ? handler(state, action) : state;
}
