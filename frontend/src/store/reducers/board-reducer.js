import { getDefaultFilter } from "../../services/filter-service";
import { createAsyncActionTypes, createAsyncHandlers } from "../utils";
import { sortByPosition } from "../../services/board/fractional-index-service";

export const SET_BOARDS = "SET_BOARDS";
export const SET_BOARD = "SET_BOARD";
export const DELETE_BOARD = "DELETE_BOARD";
export const ADD_BOARD = "ADD_BOARD";
export const UPDATE_BOARD = "UPDATE_BOARD";
export const ADD_LIST = createAsyncActionTypes("ADD_LIST");
export const MOVE_ALL_CARDS = createAsyncActionTypes("MOVE_ALL_CARDS");
export const ARCHIVE_LIST = createAsyncActionTypes("ARCHIVE_LIST");
export const UNARCHIVE_LIST = createAsyncActionTypes("UNARCHIVE_LIST");
export const ARCHIVE_ALL_CARDS_IN_LIST = createAsyncActionTypes(
  "ARCHIVE_ALL_CARDS_IN_LIST"
);
export const ADD_CARD = createAsyncActionTypes("ADD_CARD");
export const EDIT_CARD = createAsyncActionTypes("EDIT_CARD");
export const DELETE_CARD = "DELETE_CARD";
export const COPY_CARD = createAsyncActionTypes("COPY_CARD");
export const MOVE_CARD = createAsyncActionTypes("MOVE_CARD");
export const MOVE_LIST = createAsyncActionTypes("MOVE_LIST");
export const COPY_LIST = createAsyncActionTypes("COPY_LIST");
export const CREATE_LABEL = createAsyncActionTypes("CREATE_LABEL");
export const EDIT_LABEL = createAsyncActionTypes("EDIT_LABEL");
export const DELETE_LABEL = createAsyncActionTypes("DELETE_LABEL");
export const UPDATE_CARD_LABELS = createAsyncActionTypes("UPDATE_CARD_LABELS");

export const SET_LOADING = "boards/SET_LOADING";
export const SET_ERROR = "boards/SET_ERROR";
export const SET_FILTERS = "boards/SET_FILTERS";
export const CLEAR_ALL_FILTERS = "boards/CLEAR_ALL_FILTERS";

const initialState = {
  boards: [],
  board: null,
  loading: {},
  errors: {},
  filterBy: getDefaultFilter(),
};

const handlers = {
  ...createAsyncHandlers(ADD_LIST, ADD_LIST.KEY),
  [ADD_LIST.SUCCESS]: (state, action) => ({
    ...state,
    loading: { ...state.loading, [ADD_LIST.KEY]: false },
    board: {
      ...state.board,
      lists: sortByPosition([...state.board.lists, action.payload]),
    },
  }),
  ...createAsyncHandlers(MOVE_ALL_CARDS, MOVE_ALL_CARDS.KEY),
  [MOVE_ALL_CARDS.SUCCESS]: (state, action) => ({
    ...state,
    loading: { ...state.loading, [MOVE_ALL_CARDS.KEY]: false },
    board: {
      ...state.board,
      lists: action.payload,
    },
  }),
  ...createAsyncHandlers(ARCHIVE_LIST, ARCHIVE_LIST.KEY),
  [ARCHIVE_LIST.SUCCESS]: (state, action) => ({
    ...state,
    loading: { ...state.loading, [ARCHIVE_LIST.KEY]: false },
    board: {
      ...state.board,
      lists: state.board.lists.filter(list => list._id !== action.payload._id),
    },
  }),
  ...createAsyncHandlers(UNARCHIVE_LIST, UNARCHIVE_LIST.KEY),
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
        list._id === action.payload._id
          ? {
              ...list,
              cards: action.payload.cards.filter(card => !card.archivedAt),
            }
          : list
      ),
    },
  }),
  [SET_BOARDS]: (state, action) => ({
    ...state,
    boards: action.payload,
  }),
  [SET_BOARD]: (state, action) => ({
    ...state,
    board: action.payload,
  }),
  [DELETE_BOARD]: (state, action) => {
    const boards = state.boards.filter(board => board._id !== action.payload);
    return { ...state, boards };
  },
  [ADD_BOARD]: (state, action) => ({
    ...state,
    boards: [...state.boards, action.payload],
  }),
  [UPDATE_BOARD]: (state, action) => ({
    ...state,
    board: action.payload,
  }),
  ...createAsyncHandlers(MOVE_LIST, MOVE_LIST.KEY),
  [MOVE_LIST.SUCCESS]: (state, action) => {
    let newLists;
    if (state.board._id !== action.payload.boardId) {
      newLists = state.board.lists.filter(
        list => list._id !== action.payload._id
      );
    } else {
      newLists = state.board.lists.map(list =>
        list._id === action.payload._id ? { ...list, ...action.payload } : list
      );
      newLists = sortByPosition(newLists);
    }
    return {
      ...state,
      board: {
        ...state.board,
        lists: newLists,
      },
    };
  },
  ...createAsyncHandlers(COPY_LIST, COPY_LIST.KEY),
  [COPY_LIST.SUCCESS]: (state, action) => ({
    ...state,
    loading: { ...state.loading, [COPY_LIST.KEY]: false },
    board: {
      ...state.board,
      lists: action.payload,
    },
  }),
  ...createAsyncHandlers(ADD_CARD, ADD_CARD.KEY),
  [ADD_CARD.SUCCESS]: (state, action) => ({
    ...state,
    loading: { ...state.loading, [ADD_CARD.KEY]: false },
    board: {
      ...state.board,
      lists: state.board.lists.map(list =>
        list._id !== action.payload.listId
          ? list
          : {
              ...list,
              cards: sortByPosition([...list.cards, action.payload]),
            }
      ),
    },
  }),
  ...createAsyncHandlers(EDIT_CARD, EDIT_CARD.KEY),
  [EDIT_CARD.SUCCESS]: (state, action) => ({
    ...state,
    loading: { ...state.loading, [EDIT_CARD.KEY]: false },
    board: {
      ...state.board,
      lists: state.board.lists.map(list =>
        list._id === action.payload.listId
          ? {
              ...list,
              cards: list.cards.map(card =>
                card._id === action.payload._id
                  ? { ...card, ...action.payload }
                  : card
              ),
            }
          : list
      ),
    },
  }),
  [DELETE_CARD]: (state, action) => ({
    ...state,
    board: {
      ...state.board,
      lists: state.board.lists.map(list =>
        list._id === action.payload.listId
          ? {
              ...list,
              cards: list.cards.filter(
                card => card._id !== action.payload.cardId
              ),
            }
          : list
      ),
    },
  }),
  ...createAsyncHandlers(COPY_CARD, COPY_CARD.KEY),
  [COPY_CARD.SUCCESS]: (state, action) => ({
    ...state,
    loading: { ...state.loading, [COPY_CARD.KEY]: false },
    board: {
      ...state.board,
      lists: state.board.lists.map(list =>
        list._id === action.payload.listId
          ? {
              ...list,
              cards: sortByPosition([...list.cards, action.payload]),
            }
          : list
      ),
    },
  }),
  ...createAsyncHandlers(MOVE_CARD, MOVE_CARD.KEY),
  [MOVE_CARD.SUCCESS]: (state, action) => ({
    ...state,
    loading: { ...state.loading, [MOVE_CARD.KEY]: false },
    board: {
      ...state.board,
      lists: state.board.lists.map(list =>
        list._id === action.payload.listId
          ? {
              ...list,
              cards: sortByPosition([...list.cards, action.payload]),
            }
          : {
              ...list,
              cards: list.cards.filter(card => card._id !== action.payload._id),
            }
      ),
    },
  }),
  ...createAsyncHandlers(CREATE_LABEL, CREATE_LABEL.KEY),
  [CREATE_LABEL.SUCCESS]: (state, action) => ({
    ...state,
    loading: { ...state.loading, [CREATE_LABEL.KEY]: false },
    board: {
      ...state.board,
      labels: [...state.board.labels, action.payload],
    },
  }),
  ...createAsyncHandlers(EDIT_LABEL, EDIT_LABEL.KEY),
  [EDIT_LABEL.SUCCESS]: (state, action) => ({
    ...state,
    loading: { ...state.loading, [EDIT_LABEL.KEY]: false },
    board: {
      ...state.board,
      labels: state.board.labels.map(l =>
        l._id === action.payload._id ? action.payload : l
      ),
    },
  }),
  ...createAsyncHandlers(DELETE_LABEL, DELETE_LABEL.KEY),
  [DELETE_LABEL.SUCCESS]: (state, action) => ({
    ...state,
    loading: { ...state.loading, [DELETE_LABEL.KEY]: false },
    board: {
      ...state.board,
      labels: state.board.labels.filter(l => l._id !== action.payload),
      lists: state.board.lists.map(list => ({
        ...list,
        cards: list.cards.map(card => ({
          ...card,
          labelIds: card.labelIds.filter(id => id !== action.payload),
        })),
      })),
    },
  }),
  ...createAsyncHandlers(UPDATE_CARD_LABELS, UPDATE_CARD_LABELS.KEY),
  [UPDATE_CARD_LABELS.SUCCESS]: (state, action) => ({
    ...state,
    loading: { ...state.loading, [UPDATE_CARD_LABELS.KEY]: false },
    board: {
      ...state.board,
      lists: state.board.lists.map(list =>
        list._id === action.payload.listId
          ? {
              ...list,
              cards: list.cards.map(card =>
                card._id === action.payload.cardId
                  ? {
                      ...card,
                      labelIds: action.payload.updatedCardLabels,
                    }
                  : card
              ),
            }
          : list
      ),
    },
  }),
  [SET_LOADING]: (state, action) => ({
    ...state,
    loading: {
      ...state.loading,
      [action.payload.key]: action.payload.isLoading,
    },
  }),
  [SET_ERROR]: (state, action) => ({
    ...state,
    errors: {
      ...state.errors,
      [action.payload.key]: action.payload.error,
    },
  }),
  [SET_FILTERS]: (state, action) => ({
    ...state,
    filterBy: { ...state.filterBy, ...action.payload },
  }),
  [CLEAR_ALL_FILTERS]: state => ({
    ...state,
    filterBy: getDefaultFilter(),
  }),
};

export function boardReducer(state = initialState, action) {
  const handler = handlers[action.type];
  return handler ? handler(state, action) : state;
}
