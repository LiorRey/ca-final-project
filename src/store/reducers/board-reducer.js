export const SET_BOARDS = "SET_BOARDS";
export const SET_BOARD = "SET_BOARD";
export const DELETE_BOARD = "DELETE_BOARD";
export const ADD_BOARD = "ADD_BOARD";
export const UPDATE_BOARD = "UPDATE_BOARD";
export const SET_LOADING = "boards/SET_LOADING";
export const SET_ERROR = "boards/SET_ERROR";
export const SET_FILTERS = "boards/SET_FILTERS";
export const CLEAR_ALL_FILTERS = "boards/CLEAR_ALL_FILTERS";

const initialState = {
  boards: [],
  board: null,
  isLoading: false,
  error: null,
  filterBy: {
    labels: [],
    title: "",
    includeNoLabels: false,
  },
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
