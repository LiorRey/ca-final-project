# Redux Async Utilities Guide

## Overview

This guide explains the utility functions in [src/store/utils.js](../src/store/utils.js) that simplify Redux async action handling. These utilities eliminate boilerplate code and ensure consistent patterns across the application.

---

## Table of Contents

1. [Why Use These Utilities?](#why-use-these-utilities)
2. [Quick Start](#quick-start)
3. [API Reference](#api-reference)
4. [Real-World Examples](#real-world-examples)
5. [Migration Guide](#migration-guide)

---

## Why Use These Utilities?

### Without Utilities (Manual Approach)

Here's what you'd have to write manually for a single async action:

**Reducer file:**
```javascript
// Define action types
export const ARCHIVE_LIST_REQUEST = "ARCHIVE_LIST_REQUEST";
export const ARCHIVE_LIST_SUCCESS = "ARCHIVE_LIST_SUCCESS";
export const ARCHIVE_LIST_FAILURE = "ARCHIVE_LIST_FAILURE";

// Define handlers
const handlers = {
  [ARCHIVE_LIST_REQUEST]: (state) => ({
    ...state,
    loading: { ...state.loading, archiveList: true },
    errors: { ...state.errors, archiveList: null },
  }),
  [ARCHIVE_LIST_SUCCESS]: (state, action) => ({
    ...state,
    loading: { ...state.loading, archiveList: false },
    board: {
      ...state.board,
      lists: state.board.lists.filter(list => list.id !== action.payload.id),
    },
  }),
  [ARCHIVE_LIST_FAILURE]: (state, action) => ({
    ...state,
    loading: { ...state.loading, archiveList: false },
    errors: { ...state.errors, archiveList: action.payload },
  }),
};
```

**Action file:**
```javascript
export async function archiveList(boardId, listId) {
  try {
    store.dispatch({ type: ARCHIVE_LIST_REQUEST });
    const result = await boardService.archiveList(boardId, listId);
    store.dispatch({ type: ARCHIVE_LIST_SUCCESS, payload: result });
    return result;
  } catch (error) {
    store.dispatch({ type: ARCHIVE_LIST_FAILURE, payload: error.message });
    throw error;
  }
}
```

**That's ~35 lines of boilerplate code!** 😱

### With Utilities (Smart Approach)

**Reducer file:**
```javascript
export const ARCHIVE_LIST = createAsyncActionTypes("ARCHIVE_LIST");

const handlers = {
  ...createAsyncHandlers(ARCHIVE_LIST, ARCHIVE_LIST.KEY),
  [ARCHIVE_LIST.SUCCESS]: (state, action) => ({
    ...state,
    loading: { ...state.loading, [ARCHIVE_LIST.KEY]: false },
    board: {
      ...state.board,
      lists: state.board.lists.filter(list => list.id !== action.payload.id),
    },
  }),
};
```

**Action file:**
```javascript
export const archiveList = createAsyncAction(
  ARCHIVE_LIST,
  boardService.archiveList,
  store
);
```

**Just ~15 lines of clean, maintainable code!** ✨

---

## Quick Start

### Step 1: Define Action Types in Reducer

```javascript
import { createAsyncActionTypes, createAsyncHandlers } from "../utils";

// Create action types
export const LOAD_ITEMS = createAsyncActionTypes("LOAD_ITEMS");
```

### Step 2: Add Handlers to Reducer

```javascript
const handlers = {
  // Automatically handles REQUEST, SUCCESS, FAILURE
  ...createAsyncHandlers(LOAD_ITEMS, LOAD_ITEMS.KEY),

  // Override SUCCESS to add custom logic
  [LOAD_ITEMS.SUCCESS]: (state, action) => ({
    ...state,
    loading: { ...state.loading, [LOAD_ITEMS.KEY]: false },
    items: action.payload, // Your custom logic here
  }),
};
```

### Step 3: Create Action Creator

```javascript
import { createAsyncAction } from "../utils";
import { store } from "../store";
import { itemService } from "../../services/item";

export const loadItems = createAsyncAction(
  LOAD_ITEMS,
  itemService.loadItems,
  store
);
```

### Step 4: Use in Component

```javascript
import { loadItems } from "../store/actions/item-actions";

function MyComponent() {
  const { items, loading, errors } = useSelector(state => ({
    items: state.item.items,
    loading: state.item.loading.loadItems,
    errors: state.item.errors.loadItems,
  }));

  useEffect(() => {
    loadItems();
  }, []);

  if (loading) return <Spinner />;
  if (errors) return <Error message={errors} />;

  return <ItemList items={items} />;
}
```

---

## API Reference

### `createAsyncActionTypes(base)`

Creates action type constants for Redux async actions.

**Parameters:**
- `base` (string): Base action name in SCREAMING_SNAKE_CASE

**Returns:**
```javascript
{
  REQUEST: string,  // "BASE_REQUEST"
  SUCCESS: string,  // "BASE_SUCCESS"
  FAILURE: string,  // "BASE_FAILURE"
  KEY: string       // "base" (camelCase)
}
```

**Example:**
```javascript
const DELETE_CARD = createAsyncActionTypes("DELETE_CARD");
// Returns:
// {
//   REQUEST: "DELETE_CARD_REQUEST",
//   SUCCESS: "DELETE_CARD_SUCCESS",
//   FAILURE: "DELETE_CARD_FAILURE",
//   KEY: "deleteCard"
// }

// Usage in reducer:
[DELETE_CARD.REQUEST]: (state) => ({ ...state, loading: true })
[DELETE_CARD.SUCCESS]: (state, action) => ({ ...state, deletedId: action.payload })
[DELETE_CARD.FAILURE]: (state, action) => ({ ...state, error: action.payload })
```

---

### `createAsyncHandlers(actionTypes, key)`

Creates reducer handlers for async action lifecycle (REQUEST, SUCCESS, FAILURE).

**Parameters:**
- `actionTypes` (object): Action types object from `createAsyncActionTypes`
- `key` (string): The key for tracking loading/error state (usually `actionTypes.KEY`)

**Returns:**
Object with three reducer handlers: REQUEST, SUCCESS, FAILURE

**State Shape:**
```javascript
{
  loading: { [key]: boolean },  // true during request
  errors: { [key]: string|null } // error message or null
}
```

**Example:**
```javascript
const ADD_CARD = createAsyncActionTypes("ADD_CARD");

const handlers = {
  // Option 1: Use default handlers
  ...createAsyncHandlers(ADD_CARD, ADD_CARD.KEY),

  // Option 2: Override specific handlers
  ...createAsyncHandlers(ADD_CARD, ADD_CARD.KEY),
  [ADD_CARD.SUCCESS]: (state, action) => ({
    ...state,
    loading: { ...state.loading, [ADD_CARD.KEY]: false },
    cards: [...state.cards, action.payload], // Custom logic
  }),
};
```

---

### `createAsyncAction(actionTypes, serviceFunction, store)`

Creates an async action creator that handles REQUEST, SUCCESS, FAILURE lifecycle.

**Parameters:**
- `actionTypes` (object): Action types from `createAsyncActionTypes`
- `serviceFunction` (function): The service function to call
- `store` (object): Redux store instance

**Returns:**
Async function that dispatches actions and returns the result

**Example:**
```javascript
// In actions file:
export const archiveAllCardsInList = createAsyncAction(
  ARCHIVE_ALL_CARDS_IN_LIST,
  boardService.archiveAllCardsInList,
  store
);

// In component:
function handleArchive() {
  archiveAllCardsInList(boardId, listId)
    .then(result => console.log("Success:", result))
    .catch(error => console.error("Failed:", error));
}
```

---

## Real-World Examples

### Example 1: Archive All Cards in List

This is a real example from our codebase.

**Reducer ([src/store/reducers/board-reducer.js](../src/store/reducers/board-reducer.js)):**
```javascript
import { createAsyncActionTypes, createAsyncHandlers } from "../utils";

export const ARCHIVE_ALL_CARDS_IN_LIST = createAsyncActionTypes(
  "ARCHIVE_ALL_CARDS_IN_LIST"
);

const handlers = {
  ...createAsyncHandlers(
    ARCHIVE_ALL_CARDS_IN_LIST,
    ARCHIVE_ALL_CARDS_IN_LIST.KEY
  ),
  [ARCHIVE_ALL_CARDS_IN_LIST.SUCCESS]: (state, action) => ({
    ...state,
    loading: { ...state.loading, [ARCHIVE_ALL_CARDS_IN_LIST.KEY]: false },
    board: {
      ...state.board,
      lists: state.board.lists.map(list =>
        list.id === action.payload.id
          ? {
              ...list,
              cards: action.payload.cards.filter(card => !card.archivedAt),
            }
          : list
      ),
    },
  }),
};
```

**Action ([src/store/actions/board-actions.js:225](../src/store/actions/board-actions.js#L225)):**
```javascript
import { createAsyncAction } from "../utils";

export const archiveAllCardsInList = createAsyncAction(
  ARCHIVE_ALL_CARDS_IN_LIST,
  boardService.archiveAllCardsInList,
  store
);
```

**Component ([src/components/ListActionsMenu.jsx](../src/components/ListActionsMenu.jsx)):**
```javascript
function handleMenuClick(key) {
  if (key === "archiveAllCards") {
    archiveAllCardsInList(currentBoard._id, list.id);
    onClose();
  }
}
```

**What this replaced:**

Without utilities, you would need:
- 3 action type constants (REQUEST, SUCCESS, FAILURE)
- 3 reducer handlers for loading/error states
- 1 async action function with try/catch and 3 dispatches
- **Total: ~40 lines of code**

With utilities:
- 1 call to `createAsyncActionTypes`
- 1 spread of `createAsyncHandlers` + 1 custom SUCCESS handler
- 1 call to `createAsyncAction`
- **Total: ~15 lines of code**

---

### Example 2: Move All Cards

**Reducer:**
```javascript
export const MOVE_ALL_CARDS = createAsyncActionTypes("MOVE_ALL_CARDS");

const handlers = {
  ...createAsyncHandlers(MOVE_ALL_CARDS, MOVE_ALL_CARDS.KEY),
  // No custom SUCCESS needed - default behavior is sufficient
};
```

**Action:**
```javascript
export const moveAllCards = createAsyncAction(
  MOVE_ALL_CARDS,
  boardService.moveAllCards,
  store
);
```

**Component:**
```javascript
function handleMoveAll(fromListId, toListId) {
  moveAllCards(boardId, fromListId, toListId)
    .then(() => toast.success("All cards moved!"))
    .catch(error => toast.error(`Failed: ${error.message}`));
}
```

---

## Migration Guide

### Converting Existing Manual Actions to Utilities

**Before:**
```javascript
// Reducer
export const LOAD_DATA_REQUEST = "LOAD_DATA_REQUEST";
export const LOAD_DATA_SUCCESS = "LOAD_DATA_SUCCESS";
export const LOAD_DATA_FAILURE = "LOAD_DATA_FAILURE";

const handlers = {
  [LOAD_DATA_REQUEST]: (state) => ({
    ...state,
    loading: { ...state.loading, loadData: true },
    errors: { ...state.errors, loadData: null },
  }),
  [LOAD_DATA_SUCCESS]: (state, action) => ({
    ...state,
    loading: { ...state.loading, loadData: false },
    data: action.payload,
  }),
  [LOAD_DATA_FAILURE]: (state, action) => ({
    ...state,
    loading: { ...state.loading, loadData: false },
    errors: { ...state.errors, loadData: action.payload },
  }),
};

// Action
export async function loadData(id) {
  try {
    store.dispatch({ type: LOAD_DATA_REQUEST });
    const result = await dataService.loadData(id);
    store.dispatch({ type: LOAD_DATA_SUCCESS, payload: result });
    return result;
  } catch (error) {
    store.dispatch({ type: LOAD_DATA_FAILURE, payload: error.message });
    throw error;
  }
}
```

**After:**
```javascript
// Reducer
import { createAsyncActionTypes, createAsyncHandlers } from "../utils";

export const LOAD_DATA = createAsyncActionTypes("LOAD_DATA");

const handlers = {
  ...createAsyncHandlers(LOAD_DATA, LOAD_DATA.KEY),
  [LOAD_DATA.SUCCESS]: (state, action) => ({
    ...state,
    loading: { ...state.loading, [LOAD_DATA.KEY]: false },
    data: action.payload,
  }),
};

// Action
import { createAsyncAction } from "../utils";

export const loadData = createAsyncAction(
  LOAD_DATA,
  dataService.loadData,
  store
);
```

---

## Best Practices

### 1. Always Use the KEY Property

```javascript
// Good ✅
const ADD_CARD = createAsyncActionTypes("ADD_CARD");
...createAsyncHandlers(ADD_CARD, ADD_CARD.KEY)

// Bad ❌
...createAsyncHandlers(ADD_CARD, "addCard") // Manual string - prone to typos
```

### 2. Override SUCCESS Handler When Needed

```javascript
// Default handlers manage loading/errors
...createAsyncHandlers(DELETE_CARD, DELETE_CARD.KEY),

// Override SUCCESS to add custom logic
[DELETE_CARD.SUCCESS]: (state, action) => ({
  ...state,
  loading: { ...state.loading, [DELETE_CARD.KEY]: false },
  cards: state.cards.filter(card => card.id !== action.payload.id),
}),
```

### 3. Keep Service Functions Pure

```javascript
// Good ✅
export const loadItems = createAsyncAction(
  LOAD_ITEMS,
  itemService.loadItems, // Pure service function
  store
);

// Bad ❌
export const loadItems = createAsyncAction(
  LOAD_ITEMS,
  (id) => {
    // Don't inline logic here
    const items = itemService.loadItems(id);
    doSomethingElse(); // Side effects
    return items;
  },
  store
);
```

### 4. Access Loading and Error States Consistently

```javascript
function MyComponent() {
  const { data, loading, error } = useSelector(state => ({
    data: state.myFeature.data,
    // Use the KEY to access loading/error states
    loading: state.myFeature.loading.loadData,
    error: state.myFeature.errors.loadData,
  }));
}
```

---

## Troubleshooting

### "Cannot read property 'loadData' of undefined"

**Problem:** Your reducer's initial state doesn't include `loading` or `errors` objects.

**Solution:**
```javascript
const initialState = {
  data: null,
  loading: {},  // Add this
  errors: {},   // Add this
};
```

### "Actions not dispatching"

**Problem:** Forgot to pass the `store` parameter.

**Solution:**
```javascript
import { store } from "../store"; // Import store

export const myAction = createAsyncAction(
  MY_ACTION,
  myService.doSomething,
  store // Don't forget this!
);
```

### "Service function parameters not working"

**Problem:** `createAsyncAction` passes all arguments directly to the service function.

**Solution:**
```javascript
// If your service expects (boardId, listId)
export const myAction = createAsyncAction(
  MY_ACTION,
  myService.doSomething, // Must accept (boardId, listId)
  store
);

// Call with matching parameters
myAction(boardId, listId);
```

---

## Summary

| Feature | Without Utilities | With Utilities |
|---------|------------------|----------------|
| Lines of code | ~35-40 | ~10-15 |
| Action types | 3 manual constants | 1 function call |
| Reducer handlers | 3 manual handlers | 1 spread + optional override |
| Action creator | Manual try/catch with 3 dispatches | 1 function call |
| Maintainability | Copy-paste errors, inconsistent patterns | DRY, consistent patterns |
| Type safety | Manual string matching | Automatic with actionTypes object |

**Key Takeaway:** These utilities reduce boilerplate by ~65% while ensuring consistent async patterns across your Redux codebase.

---

## Related Files

- [src/store/utils.js](../src/store/utils.js) - Utility functions source
- [src/store/reducers/board-reducer.js](../src/store/reducers/board-reducer.js) - Real-world usage
- [src/store/actions/board-actions.js](../src/store/actions/board-actions.js) - Real-world usage
