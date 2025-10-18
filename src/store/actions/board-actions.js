import {
  SET_BOARDS,
  ADD_BOARD,
  UPDATE_BOARD,
  DELETE_BOARD,
  SET_BOARD,
  SET_LOADING,
  SET_ERROR,
} from "../reducers/board-reducer";

import { store } from "../store";
import { boardService } from "../../services/board";

export async function loadBoards() {
  try {
    store.dispatch(setLoading(true));
    const boards = await boardService.query();
    store.dispatch(setBoards(boards));
  } catch (error) {
    store.dispatch(setError(`Error loading boards: ${error.message}`));
  } finally {
    store.dispatch(setLoading(false));
  }
}

export async function loadBoard(boardId) {
  try {
    store.dispatch(setLoading(true));
    const board = await boardService.getById(boardId);
    store.dispatch(setBoard(board));
  } catch (error) {
    store.dispatch(setError(`Error loading board: ${error.message}`));
  } finally {
    store.dispatch(setLoading(false));
  }
}

export async function createBoard(board) {
  try {
    const newBoard = await boardService.save(board);
    store.dispatch(addBoard(newBoard));
    return newBoard;
  } catch (error) {
    store.dispatch(setError(`Error creating board: ${error.message}`));
    throw error;
  }
}

export async function updateBoard(
  board,
  { listId = null, cardId = null, key, value }
) {
  try {
    const updatedBoard = await boardService.updateBoardWithActivity(board, {
      listId,
      cardId,
      key,
      value,
    });
    store.dispatch(editBoard(updatedBoard));
    return updatedBoard;
  } catch (error) {
    store.dispatch(setError(`Error updating board: ${error.message}`));
    throw error;
  }
}

export async function deleteBoard(boardId) {
  try {
    await boardService.remove(boardId);
    store.dispatch(deleteBoardAction(boardId));
  } catch (error) {
    store.dispatch(setError(`Error removing board: ${error.message}`));
    throw error;
  }
}

export function setBoards(boards) {
  return { type: SET_BOARDS, payload: boards };
}

export function addBoard(board) {
  return { type: ADD_BOARD, payload: board };
}

export function editBoard(board) {
  return { type: UPDATE_BOARD, payload: board };
}

export function deleteBoardAction(boardId) {
  return { type: DELETE_BOARD, payload: boardId };
}

export function setBoard(board) {
  return { type: SET_BOARD, payload: board };
}

export function setLoading(isLoading) {
  return { type: SET_LOADING, payload: isLoading };
}

export function setError(error) {
  return { type: SET_ERROR, payload: error };
}
