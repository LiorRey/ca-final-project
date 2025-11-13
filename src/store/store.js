import { legacy_createStore as createStore, combineReducers } from "redux";
import { boardReducer } from "./reducers/board-reducer";
import { userReducer } from "./reducers/user-reducer";
import { uiReducer } from "./reducers/ui-reducer";
import { authReducer } from "./reducers/auth-reducer";

const rootReducer = combineReducers({
  boards: boardReducer,
  users: userReducer,
  auth: authReducer,
  ui: uiReducer,
});

const middleware = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
  : undefined;
export const store = createStore(rootReducer, middleware);
