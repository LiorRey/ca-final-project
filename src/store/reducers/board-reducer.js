export const SET_BOARDS = "SET_BOARDS";
export const SET_BOARD = "SET_BOARD";
export const DELETE_BOARD = "DELETE_BOARD";
export const ADD_BOARD = "ADD_BOARD";
export const UPDATE_BOARD = "UPDATE_BOARD";
export const SET_LOADING = "boards/SET_LOADING";
export const SET_ERROR = "boards/SET_ERROR";

const initialState = {
  boards: [],
  board: null,
  isLoading: false,
  error: null,
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
      const updatedBoards = state.boards.map(board =>
        board._id === action.payload._id ? action.payload : board
      );
      const updatedCurrentBoard =
        state.board && state.board._id === action.payload._id
          ? action.payload
          : state.board;

      return {
        ...state,
        boards: updatedBoards,
        board: updatedCurrentBoard,
      };
    case SET_LOADING:
      return { ...state, isLoading: action.payload };
    case SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}
