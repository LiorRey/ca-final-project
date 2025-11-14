import { SET_ACTIVE_LIST_INDEX } from "../reducers/ui-reducer";
import { store } from "../store";

export function setActiveListIndexAction(index) {
  return { type: SET_ACTIVE_LIST_INDEX, payload: index };
}

export function setActiveListIndex(index) {
  store.dispatch(setActiveListIndexAction(index));
}
