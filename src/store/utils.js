/**
 * Creates async action type constants for Redux async actions.
 * Generates REQUEST, SUCCESS, FAILURE action types and a camelCase KEY.
 *
 * @param {string} base - The base action name in SCREAMING_SNAKE_CASE (e.g., "ADD_LIST")
 * @returns {{REQUEST: string, SUCCESS: string, FAILURE: string, KEY: string}}
 *   Object containing action type strings and a camelCase key
 *
 * @example
 * const ADD_LIST = createAsyncActionTypes("ADD_LIST");
 * // Returns:
 * // {
 * //   REQUEST: "ADD_LIST_REQUEST",
 * //   SUCCESS: "ADD_LIST_SUCCESS",
 * //   FAILURE: "ADD_LIST_FAILURE",
 * //   KEY: "addList"
 * // }
 *
 * // Usage in reducer:
 * [ADD_LIST.REQUEST]: (state) => ({ ...state, loading: true })
 *
 * // Usage with createAsyncHandlers:
 * createAsyncHandlers(ADD_LIST, ADD_LIST.KEY)
 */
export function createAsyncActionTypes(base) {
  // BASE_ACTION -> baseAction
  const key = base
    .split("_")
    .map((w, i) =>
      i === 0 ? w.toLowerCase() : w[0] + w.slice(1).toLowerCase()
    )
    .join("");
  return {
    REQUEST: `${base}_REQUEST`,
    SUCCESS: `${base}_SUCCESS`,
    FAILURE: `${base}_FAILURE`,
    KEY: key,
  };
}

/**
 * Creates reducer handlers for async action lifecycle (REQUEST, SUCCESS, FAILURE).
 * Automatically manages loading and error states in the Redux store.
 *
 * @param {{REQUEST: string, SUCCESS: string, FAILURE: string}} actionTypes
 *   Action types object created by createAsyncActionTypes
 * @param {string} key - The key to use for tracking loading/error state (e.g., "addList")
 * @returns {Object.<string, Function>} Object mapping action types to reducer functions
 *
 * @example
 * const ADD_LIST = createAsyncActionTypes("ADD_LIST");
 *
 * const handlers = {
 *   ...createAsyncHandlers(ADD_LIST, ADD_LIST.KEY),
 *   // Override SUCCESS to add custom logic
 *   [ADD_LIST.SUCCESS]: (state, action) => ({
 *     ...state,
 *     loading: { ...state.loading, [ADD_LIST.KEY]: false },
 *     items: [...state.items, action.payload],
 *   }),
 * };
 *
 * // State shape:
 * // {
 * //   loading: { addList: true/false },
 * //   errors: { addList: null | errorMessage }
 * // }
 */
export function createAsyncHandlers(actionTypes, key) {
  return {
    [actionTypes.REQUEST]: state => ({
      ...state,
      loading: { ...state.loading, [key]: true },
      errors: { ...state.errors, [key]: null },
    }),
    [actionTypes.SUCCESS]: state => ({
      ...state,
      loading: { ...state.loading, [key]: false },
    }),
    [actionTypes.FAILURE]: (state, action) => ({
      ...state,
      loading: { ...state.loading, [key]: false },
      errors: { ...state.errors, [key]: action.payload },
    }),
  };
}
