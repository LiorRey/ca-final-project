import {
  SET_BOARDS,
  SET_BOARD,
  ADD_BOARD,
  UPDATE_BOARD,
  DELETE_BOARD,
  ADD_LIST,
  MOVE_LIST,
  UPDATE_LIST,
  COPY_LIST,
  DELETE_LIST,
  ARCHIVE_LIST,
  UNARCHIVE_LIST,
  ARCHIVE_ALL_CARDS_IN_LIST,
  MOVE_ALL_CARDS,
  ADD_CARD,
  EDIT_CARD,
  UPSERT_CARD_COVER,
  ADD_CARD_ATTACHMENT,
  REMOVE_CARD_ATTACHMENT,
  DELETE_CARD,
  COPY_CARD,
  MOVE_CARD,
  ADD_ASSIGNEE,
  REMOVE_ASSIGNEE,
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
    const boards = await boardService.getBoardPreviews();
    store.dispatch(setBoards(boards));
  } catch (error) {
    store.dispatch(
      setError("loadBoards", `Error loading boards: ${error.message}`)
    );
  } finally {
    store.dispatch(setLoading("loadBoards", false));
  }
}

export const loadBoard = createAsyncAction(
  SET_BOARD,
  boardService.getFullById,
  store
);

export const createBoard = createAsyncAction(
  ADD_BOARD,
  boardService.createBoard,
  store
);

export const updateBoard = createAsyncAction(
  UPDATE_BOARD,
  boardService.updateBoard,
  store
);

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

export const updateList = createAsyncAction(
  UPDATE_LIST,
  boardService.updateList,
  store
);

export const copyList = createAsyncAction(
  COPY_LIST,
  boardService.copyList,
  store
);

export const deleteList = createAsyncAction(
  DELETE_LIST,
  boardService.deleteList,
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

export const updateCardCover = createAsyncAction(
  UPSERT_CARD_COVER,
  boardService.updateCardCover,
  store
);

export const addCardAttachment = createAsyncAction(
  ADD_CARD_ATTACHMENT,
  boardService.addCardAttachment,
  store
);

export const removeCardAttachment = createAsyncAction(
  REMOVE_CARD_ATTACHMENT,
  boardService.removeCardAttachment,
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

export const addAssignee = createAsyncAction(
  ADD_ASSIGNEE,
  boardService.addAssignee,
  store
);

export const removeAssignee = createAsyncAction(
  REMOVE_ASSIGNEE,
  boardService.removeAssignee,
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

export const updateCardLabels = createAsyncAction(
  UPDATE_CARD_LABELS,
  boardService.updateCardLabels,
  store
);

export function setBoards(boards) {
  return { type: SET_BOARDS, payload: boards };
}

export function setBoard(board) {
  return { type: SET_BOARD, payload: board };
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
