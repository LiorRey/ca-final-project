export const createAsyncActionTypes = base => ({
  REQUEST: `${base}_REQUEST`,
  SUCCESS: `${base}_SUCCESS`,
  FAILURE: `${base}_FAILURE`,
});

export const createAsyncHandlers = (actionTypes, key) => ({
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
});
