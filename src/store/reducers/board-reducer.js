import { getDefaultFilter } from "../../services/filter-service";
import { createAsyncActionTypes, createAsyncHandlers } from "../utils";

export const SET_BOARDS = "SET_BOARDS";
export const SET_BOARD = "SET_BOARD";
export const DELETE_BOARD = "DELETE_BOARD";
export const ADD_BOARD = "ADD_BOARD";
export const UPDATE_BOARD = "UPDATE_BOARD";
export const ADD_LIST = createAsyncActionTypes("ADD_LIST");
export const MOVE_ALL_CARDS = createAsyncActionTypes("MOVE_ALL_CARDS");
export const ADD_CARD = "ADD_CARD";
export const EDIT_CARD = "EDIT_CARD";
export const DELETE_CARD = "DELETE_CARD";
export const MOVE_LIST = "MOVE_LIST";
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
  ...createAsyncHandlers(ADD_LIST, "addList"),
  [ADD_LIST.SUCCESS]: (state, action) => ({
    ...state,
    loading: { ...state.loading, addList: false },
    board: {
      ...state.board,
      lists: [...state.board.lists, action.payload],
    },
  }),
  ...createAsyncHandlers(MOVE_ALL_CARDS, "moveAllCards"),
  [MOVE_ALL_CARDS.SUCCESS]: (state, action) => ({
    ...state,
    loading: { ...state.loading, moveAllCards: false },
    board: {
      ...state.board,
      lists: action.payload,
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
  [MOVE_LIST]: (state, action) => ({
    ...state,
    board: {
      ...state.board,
      lists: action.payload,
    },
  }),
  [ADD_CARD]: (state, action) => ({
    ...state,
    board: {
      ...state.board,
      lists: state.board.lists.map(list =>
        list.id === action.payload.listId
          ? { ...list, cards: [...list.cards, action.payload.card] }
          : list
      ),
    },
  }),
  [EDIT_CARD]: (state, action) => ({
    ...state,
    board: {
      ...state.board,
      lists: state.board.lists.map(list =>
        list.id === action.payload.listId
          ? {
              ...list,
              cards: list.cards.map(card =>
                card.id === action.payload.card.id ? action.payload.card : card
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
        list.id === action.payload.listId
          ? {
              ...list,
              cards: list.cards.filter(
                card => card.id !== action.payload.cardId
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
