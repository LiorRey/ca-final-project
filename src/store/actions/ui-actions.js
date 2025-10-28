import { SET_ACTIVE_LIST_INDEX } from "../reducers/ui-reducer";

export function setActiveListIndex(index) {
  return { type: SET_ACTIVE_LIST_INDEX, payload: index };
}
