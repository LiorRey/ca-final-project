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
