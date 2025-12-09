import {
  SET_BOARDS,
  SET_BOARD,
  ADD_BOARD,
  UPDATE_BOARD,
  DELETE_BOARD,
  SET_BOARD_SEARCH,
  ADD_LIST,
  MOVE_LIST,
  COPY_LIST,
  ARCHIVE_LIST,
  UNARCHIVE_LIST,
  ARCHIVE_ALL_CARDS_IN_LIST,
  MOVE_ALL_CARDS,
  ADD_CARD,
  EDIT_CARD,
  DELETE_CARD,
  COPY_CARD,
  MOVE_CARD,
  CREATE_LABEL,
  EDIT_LABEL,
  DELETE_LABEL,
  UPDATE_CARD_LABELS,
  SET_FILTERS,
  CLEAR_ALL_FILTERS,
  SET_LOADING,
  SET_ERROR,
} from "../reducers/board-reducer";

import { store } from "../store";
import { boardService } from "../../services/board";
import { createAsyncAction } from "../utils";

export async function loadBoards() {
  try {
    store.dispatch(setLoading("loadBoards", true));
    const boards = await boardService.query();
    store.dispatch(setBoards(boards));
  } catch (error) {
    store.dispatch(
      setError("loadBoards", `Error loading boards: ${error.message}`)
    );
  } finally {
    store.dispatch(setLoading("loadBoards", false));
  }
}

export async function loadBoard(boardId, filterBy = {}) {
  try {
    store.dispatch(setLoading("loadBoard", true));
    const board = await boardService.getFullById(boardId, filterBy);
    store.dispatch(setBoard(board));
  } catch (error) {
    store.dispatch(
      setError("loadBoard", `Error loading board: ${error.message}`)
    );
  } finally {
    store.dispatch(setLoading("loadBoard", false));
  }
}

export async function createBoard(board) {
  try {
    const newBoard = await boardService.save(board);
    store.dispatch(addBoard(newBoard));
    return newBoard;
  } catch (error) {
    store.dispatch(
      setError("createBoard", `Error creating board: ${error.message}`)
    );
    throw error;
  }
}

export async function updateBoard(
  boardId,
  updates,
  { listId = null, cardId = null } = {}
) {
  try {
    const updatedBoard = await boardService.updateBoard(boardId, updates, {
      listId,
      cardId,
    });
    store.dispatch(editBoard(updatedBoard));
    return updatedBoard;
  } catch (error) {
    store.dispatch(
      setError("updateBoard", `Error updating board: ${error.message}`)
    );
    throw error;
  }
}

export async function deleteBoard(boardId) {
  try {
    await boardService.remove(boardId);
    store.dispatch(deleteBoardAction(boardId));
  } catch (error) {
    store.dispatch(
      setError("deleteBoard", `Error removing board: ${error.message}`)
    );
    throw error;
  }
}

export const createList = createAsyncAction(
  ADD_LIST,
  boardService.createList,
  store
);

export const moveList = createAsyncAction(
  MOVE_LIST,
  boardService.moveList,
  store
);

export const copyList = createAsyncAction(
  COPY_LIST,
  boardService.copyList,
  store
);

export const archiveList = createAsyncAction(
  ARCHIVE_LIST,
  boardService.archiveList,
  store
);

export const unarchiveList = createAsyncAction(
  UNARCHIVE_LIST,
  boardService.unarchiveList,
  store
);

export const archiveAllCardsInList = createAsyncAction(
  ARCHIVE_ALL_CARDS_IN_LIST,
  boardService.archiveAllCardsInList,
  store
);

export async function moveAllCards(
  boardId,
  sourceListId,
  targetListId = null,
  { newListName = "New List" } = {}
) {
  try {
    store.dispatch({ type: MOVE_ALL_CARDS.REQUEST });
    const updatedLists = await boardService.moveAllCards(
      boardId,
      sourceListId,
      targetListId,
      { newListName }
    );
    store.dispatch({ type: MOVE_ALL_CARDS.SUCCESS, payload: updatedLists });
  } catch (error) {
    store.dispatch({ type: MOVE_ALL_CARDS.FAILURE, payload: error.message });
    throw error;
  }
}

export const addCard = createAsyncAction(ADD_CARD, boardService.addCard, store);

export const editCard = createAsyncAction(
  EDIT_CARD,
  boardService.editCard,
  store
);

export const deleteCard = createAsyncAction(
  DELETE_CARD,
  boardService.deleteCard,
  store
);

export const copyCard = createAsyncAction(
  COPY_CARD,
  boardService.copyCard,
  store
);

export const moveCard = createAsyncAction(
  MOVE_CARD,
  boardService.moveCard,
  store
);

export const createLabel = createAsyncAction(
  CREATE_LABEL,
  boardService.createLabel,
  store
);

export const editLabel = createAsyncAction(
  EDIT_LABEL,
  boardService.editLabel,
  store
);

export const deleteLabel = createAsyncAction(
  DELETE_LABEL,
  boardService.deleteLabel,
  store
);

export async function updateCardLabels(
  boardId,
  listId,
  cardId,
  updatedCardLabels
) {
  try {
    store.dispatch({ type: UPDATE_CARD_LABELS.REQUEST });
    await boardService.updateCardLabels(
      boardId,
      listId,
      cardId,
      updatedCardLabels
    );
    store.dispatch({
      type: UPDATE_CARD_LABELS.SUCCESS,
      payload: { listId, cardId, updatedCardLabels },
    });
  } catch (error) {
    store.dispatch({
      type: UPDATE_CARD_LABELS.FAILURE,
      payload: error.message,
    });
    throw error;
  }
}

export function setBoards(boards) {
  return { type: SET_BOARDS, payload: boards };
}

export function setBoard(board) {
  return { type: SET_BOARD, payload: board };
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

export function editCardAction(card, listId) {
  return { type: EDIT_CARD, payload: { card, listId } };
}

export function deleteCardAction(cardId, listId) {
  return { type: DELETE_CARD, payload: { cardId, listId } };
}

export function setFilters(filterBy) {
  return { type: SET_FILTERS, payload: filterBy };
}

export function clearAllFilters() {
  return { type: CLEAR_ALL_FILTERS };
}

export function setLoading(key, isLoading) {
  return { type: SET_LOADING, payload: { key, isLoading } };
}

export function setError(key, error) {
  return { type: SET_ERROR, payload: { key, error } };
}
