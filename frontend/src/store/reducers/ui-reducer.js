export const SET_ACTIVE_LIST_INDEX = "ui/lists/SET_ACTIVE_LIST_INDEX";

const initialState = {
  lists: {
    activeListIndex: null,
  },
};

export function uiReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ACTIVE_LIST_INDEX:
      return {
        ...state,
        lists: {
          ...state.lists,
          activeListIndex: action.payload,
        },
      };
    default:
      return state;
  }
}
