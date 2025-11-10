import { createAsyncActionTypes, createAsyncHandlers } from "../utils";

const initialState = {
  currentUser: null,
  loading: {},
  errors: {},
};

const handlers = {};

export function authReducer(state = initialState, action) {
  const handler = handlers[action.type];
  return handler ? handler(state, action) : state;
}
