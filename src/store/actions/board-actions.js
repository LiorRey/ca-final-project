import {
  SET_BOARDS,
  ADD_BOARD,
  UPDATE_BOARD,
  DELETE_BOARD,
  SET_BOARD,
  MOVE_LIST,
  SET_LOADING,
  SET_ERROR,
  SET_FILTERS,
  CLEAR_ALL_FILTERS,
  ADD_LIST,
  MOVE_ALL_CARDS,
  ADD_CARD,
  EDIT_CARD,
  DELETE_CARD,
  CREATE_LABEL,
  EDIT_LABEL,
  DELETE_LABEL,
  UPDATE_CARD_LABELS,
  ARCHIVE_LIST,
  UNARCHIVE_LIST,
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
    const board = await boardService.getById(boardId, filterBy);
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

export async function copyList(boardId, listId, newName) {
  try {
    const updatedLists = await boardService.copyList(boardId, listId, newName);
    updateBoard(boardId, { lists: updatedLists });
  } catch (error) {
    store.dispatch(
      setError("copyList", `Error copying list: ${error.message}`)
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

export async function addCard(boardId, card, listId) {
  try {
    const newCard = await boardService.addCard(boardId, card, listId);
    store.dispatch(addCardAction(newCard, listId));
  } catch (error) {
    store.dispatch(setError("addCard", `Error adding card: ${error.message}`));
    throw error;
  }
}

export async function editCard(boardId, card, listId) {
  try {
    const updatedCard = await boardService.editCard(boardId, card, listId);
    store.dispatch(editCardAction(updatedCard, listId));
  } catch (error) {
    store.dispatch(
      setError("editCard", `Error editing card: ${error.message}`)
    );
    throw error;
  }
}

export async function deleteCard(boardId, cardId, listId) {
  try {
    const deletedCard = await boardService.deleteCard(boardId, cardId, listId);
    store.dispatch(deleteCardAction(deletedCard.id, listId));
  } catch (error) {
    store.dispatch(
      setError("deleteCard", `Error deleting card: ${error.message}`)
    );
    throw error;
  }
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

export async function moveList(
  sourceBoardId,
  sourceIndex,
  targetIndex,
  targetBoardId,
  currentBoardId
) {
  try {
    const updatedLists = await boardService.moveList(
      sourceBoardId,
      sourceIndex,
      targetIndex,
      targetBoardId,
      currentBoardId
    );
    store.dispatch(moveListAction(updatedLists));
    return updatedLists;
  } catch (error) {
    store.dispatch(setError("moveList", `Error moving list: ${error.message}`));
    throw error;
  }
}

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

export function setLoading(key, isLoading) {
  return { type: SET_LOADING, payload: { key, isLoading } };
}

export function setError(key, error) {
  return { type: SET_ERROR, payload: { key, error } };
}

export function setFilters(filterBy) {
  return { type: SET_FILTERS, payload: filterBy };
}

export function clearAllFilters() {
  return { type: CLEAR_ALL_FILTERS };
}

export function moveListAction(lists) {
  return { type: MOVE_LIST, payload: lists };
}
