import {
  SET_BOARDS,
  SET_BOARD,
  ADD_BOARD,
  UPDATE_BOARD,
  DELETE_BOARD,
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

export async function createList(boardId, listData) {
  try {
    store.dispatch({ type: ADD_LIST.REQUEST });
    const newList = await boardService.createList(boardId, listData);
    store.dispatch({ type: ADD_LIST.SUCCESS, payload: newList });
    return newList;
  } catch (error) {
    store.dispatch({ type: ADD_LIST.FAILURE, payload: error.message });
    throw error;
  }
}

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

export async function deleteCard(boardId, cardId, listId) {
  try {
    await boardService.deleteCard(boardId, cardId, listId);
    store.dispatch(deleteCardAction(cardId, listId));
  } catch (error) {
    store.dispatch(
      setError("deleteCard", `Error deleting card: ${error.message}`)
    );
    throw error;
  }
}

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

export async function createLabel(boardId, label) {
  try {
    store.dispatch({ type: CREATE_LABEL.REQUEST });
    await boardService.createLabel(boardId, label);
    store.dispatch({ type: CREATE_LABEL.SUCCESS, payload: label });
  } catch (error) {
    store.dispatch({ type: CREATE_LABEL.FAILURE, payload: error.message });
    throw error;
  }
}

export async function editLabel(boardId, label) {
  try {
    store.dispatch({ type: EDIT_LABEL.REQUEST });
    await boardService.editLabel(boardId, label);
    store.dispatch({ type: EDIT_LABEL.SUCCESS, payload: label });
  } catch (error) {
    store.dispatch({ type: EDIT_LABEL.FAILURE, payload: error.message });
    throw error;
  }
}

export async function deleteLabel(boardId, labelId) {
  try {
    store.dispatch({ type: DELETE_LABEL.REQUEST });
    await boardService.deleteLabel(boardId, labelId);
    store.dispatch({ type: DELETE_LABEL.SUCCESS, payload: labelId });
  } catch (error) {
    store.dispatch({ type: DELETE_LABEL.FAILURE, payload: error.message });
    throw error;
  }
}

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
    console.log("updatedCardLabels", updatedCardLabels);
    store.dispatch({
      type: UPDATE_CARD_LABELS.SUCCESS,
      payload: { listId, cardId, updatedCardLabels },
    });
  } catch (error) {
    console.error("Error updating card labels:", error);
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

export function addCardAction(card, listId) {
  return { type: ADD_CARD, payload: { card, listId } };
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
