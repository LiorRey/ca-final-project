import { storageService } from "../async-storage-service";
import { loadFromStorage, makeId, saveToStorage } from "../util-service";
import boardDataGenerator from "./board-data-generator";
import { USER_STORAGE_KEY } from "../user/user-service-local.js";

const BOARDS_STORAGE_KEY = "boardDB";
_createBoards();

export const boardService = {
  query,
  getById,
  remove,
  save,
  updateBoardWithActivity,
  clearData,
  reCreateBoards,
  getEmptyList,
};
window.bs = boardService;

async function query() {
  try {
    return await storageService.query(BOARDS_STORAGE_KEY);
  } catch (error) {
    console.log("Cannot load boards:", error);

    throw error;
  }
}

function getById(boardId) {
  try {
    return storageService.get(BOARDS_STORAGE_KEY, boardId);
  } catch (error) {
    console.log("Cannot get board:", error);

    throw error;
  }
}

async function remove(boardId) {
  try {
    await storageService.remove(BOARDS_STORAGE_KEY, boardId);
  } catch (error) {
    console.log("Cannot remove board:", error);

    throw error;
  }
}

async function updateBoardWithActivity(
  board,
  { listId = null, cardId = null, key, value }
) {
  try {
    if (!board || !key) throw new Error("Board and key are required");

    let { board: updatedBoard, prevValue } = _applyBoardUpdate(
      board,
      { key, value },
      listId,
      cardId
    );

    updatedBoard = _addBoardActivity(
      updatedBoard,
      key,
      value,
      prevValue,
      listId,
      cardId
    );

    return save(updatedBoard);
  } catch (error) {
    console.error("Cannot update board:", error);

    throw error;
  }
}

export function getEmptyList() {
  return {
    id: crypto.randomUUID(),
    name: "",
    cards: [],
  };
}

function _applyBoardUpdate(
  board,
  { key, value },
  listId = null,
  cardId = null
) {
  try {
    let prevValue;

    if (cardId) {
      if (!listId) throw new Error("Card update requires listId");

      const list = board.lists?.find(l => l.id === listId);
      if (!list) throw new Error("List not found");

      const card = list.cards?.find(c => c.id === cardId);
      if (!card) throw new Error("Card not found");

      prevValue = card[key];
      card[key] = value;
    } else if (listId) {
      const list = board.lists?.find(l => l.id === listId);
      if (!list) throw new Error("List not found");

      prevValue = list[key];
      list[key] = value;
    } else {
      prevValue = board[key];
      board[key] = value;
    }

    return { board, prevValue };
  } catch (error) {
    console.warn("Board updated failed:", error.message);

    throw error;
  }
}

function _addBoardActivity(
  board,
  key,
  value,
  prevValue,
  listId = null,
  cardId = null
) {
  const activity = _createActivity(
    board._id,
    key,
    value,
    prevValue,
    listId,
    cardId
  );

  board.activities = board.activities || [];
  board.activities.unshift(activity);

  return board;
}

function _createActivity(
  boardId,
  key,
  value,
  prevValue,
  listId = null,
  cardId = null
) {
  return {
    id: makeId(),
    type: "activity",
    createdAt: Date.now(),
    board: boardId,
    list: listId,
    card: cardId,
    key,
    value,
    prevValue,
  };
}

export async function save(board) {
  try {
    if (board._id) {
      return await storageService.put(BOARDS_STORAGE_KEY, { ...board });
    } else {
      return await storageService.post(BOARDS_STORAGE_KEY, { ...board });
    }
  } catch (error) {
    console.log("Cannot save board:", error);

    throw error;
  }
}

function _createBoards() {
  let boards = loadFromStorage(BOARDS_STORAGE_KEY);
  if (!boards || !boards.length) {
    const data = boardDataGenerator.generateSampleData();
    const { sampleBoards, allUsers } = data;
    saveToStorage(BOARDS_STORAGE_KEY, sampleBoards);
    saveToStorage(USER_STORAGE_KEY, allUsers);
  }
}

function clearData() {
  saveToStorage(BOARDS_STORAGE_KEY, []);
  saveToStorage(USER_STORAGE_KEY, []);
}

function reCreateBoards() {
  clearData();
  _createBoards();
}
