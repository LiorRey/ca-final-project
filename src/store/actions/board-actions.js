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

export async function loadBoard(boardId, filterBy = {}) {
  try {
    store.dispatch(setLoading(true));
    const board = await boardService.getById(boardId, filterBy);
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

export async function copyList(boardId, listId, newName) {
  try {
    const updatedLists = await boardService.copyList(boardId, listId, newName);
    updateBoard(boardId, { lists: updatedLists });
  } catch (error) {
    store.dispatch(setError(`Error copying list: ${error.message}`));
    throw error;
  }
}

export async function createList(boardId, listName = "New List") {
  try {
    const newList = await boardService.createList(boardId, listName);
    store.dispatch(addListAction(newList));
    return newList;
  } catch (error) {
    store.dispatch(setError(`Error creating new list: ${error.message}`));
    throw error;
  }
}

export async function moveAllCardsToList(boardId, sourceListId, targetListId) {
  try {
    const updatedLists = await boardService.moveAllCards(
      boardId,
      sourceListId,
      targetListId
    );
    store.dispatch(moveAllCardsAction(updatedLists));
  } catch (error) {
    store.dispatch(setError(`Error moving all cards: ${error.message}`));
    throw error;
  }
}

export async function createListAndMoveAllCards(
  boardId,
  sourceListId,
  listName = "New List"
) {
  try {
    const { updatedLists } = await boardService.createListAndMoveAllCards(
      boardId,
      sourceListId,
      listName
    );
    store.dispatch(moveAllCardsAction(updatedLists));
  } catch (error) {
    store.dispatch(
      setError(`Error creating list and moving cards: ${error.message}`)
    );
    throw error;
  }
}

export async function addCard(boardId, card, listId) {
  try {
    const newCard = await boardService.addCard(boardId, card, listId);
    store.dispatch(addCardAction(newCard, listId));
  } catch (error) {
    store.dispatch(setError(`Error adding card: ${error.message}`));
    throw error;
  }
}

export async function editCard(boardId, card, listId) {
  try {
    const updatedCard = await boardService.editCard(boardId, card, listId);
    store.dispatch(editCardAction(updatedCard, listId));
  } catch (error) {
    store.dispatch(setError(`Error editing card: ${error.message}`));
    throw error;
  }
}

export async function deleteCard(boardId, cardId, listId) {
  try {
    const deletedCard = await boardService.deleteCard(boardId, cardId, listId);
    store.dispatch(deleteCardAction(deletedCard.id, listId));
  } catch (error) {
    store.dispatch(setError(`Error deleting card: ${error.message}`));
    throw error;
  }
}

export function deleteCardAction(cardId, listId) {
  return { type: DELETE_CARD, payload: { cardId, listId } };
}

export function addCardAction(card, listId) {
  return { type: ADD_CARD, payload: { card, listId } };
}

export function editCardAction(card, listId) {
  return { type: EDIT_CARD, payload: { card, listId } };
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
    store.dispatch(setError(`Error moving list: ${error.message}`));
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

export function setFilters(filterBy) {
  return { type: SET_FILTERS, payload: filterBy };
}

export function clearAllFilters() {
  return { type: CLEAR_ALL_FILTERS };
}

export function moveListAction(lists) {
  return { type: MOVE_LIST, payload: lists };
}

export function addListAction(list) {
  return { type: ADD_LIST, payload: list };
}

export function moveAllCardsAction(updatedLists) {
  return { type: MOVE_ALL_CARDS, payload: updatedLists };
}
