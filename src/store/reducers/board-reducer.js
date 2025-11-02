import { getDefaultFilter } from "../../services/filter-service";

export const SET_BOARDS = "SET_BOARDS";
export const SET_BOARD = "SET_BOARD";
export const DELETE_BOARD = "DELETE_BOARD";
export const ADD_BOARD = "ADD_BOARD";
export const UPDATE_BOARD = "UPDATE_BOARD";
export const ADD_LIST = "ADD_LIST";
export const MOVE_ALL_CARDS = "MOVE_ALL_CARDS";
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
  isLoading: false,
  error: null,
  filterBy: getDefaultFilter(),
};

export function boardReducer(state = initialState, action) {
  switch (action.type) {
    case SET_BOARDS:
      return { ...state, boards: action.payload };
    case SET_BOARD:
      return { ...state, board: action.payload };
    case DELETE_BOARD:
      const boards = state.boards.filter(board => board._id !== action.payload);
      return { ...state, boards };
    case ADD_BOARD:
      return { ...state, boards: [...state.boards, action.payload] };
    case UPDATE_BOARD:
      return { ...state, board: action.payload };
    case MOVE_LIST:
      return {
        ...state,
        board: {
          ...state.board,
          lists: action.payload,
        },
      };
    case ADD_LIST:
      return {
        ...state,
        board: {
          ...state.board,
          lists: [...state.board.lists, action.payload],
        },
      };
    case MOVE_ALL_CARDS:
      return {
        ...state,
        board: {
          ...state.board,
          lists: action.payload,
        },
      };
    case ADD_CARD:
      return {
        ...state,
        board: {
          ...state.board,
          lists: state.board.lists.map(list =>
            list.id === action.payload.listId
              ? { ...list, cards: [...list.cards, action.payload.card] }
              : list
          ),
        },
      };
    case EDIT_CARD:
      return {
        ...state,
        board: {
          ...state.board,
          lists: state.board.lists.map(list =>
            list.id === action.payload.listId
              ? {
                  ...list,
                  cards: list.cards.map(card =>
                    card.id === action.payload.card.id
                      ? action.payload.card
                      : card
                  ),
                }
              : list
          ),
        },
      };
    case DELETE_CARD:
      return {
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
      };
    case SET_LOADING:
      return { ...state, isLoading: action.payload };
    case SET_ERROR:
      return { ...state, error: action.payload };
    case SET_FILTERS:
      return {
        ...state,
        filterBy: { ...state.filterBy, ...action.payload },
      };
    case CLEAR_ALL_FILTERS:
      return {
        ...state,
        filterBy: getDefaultFilter(),
      };
    default:
      return state;
  }
}
