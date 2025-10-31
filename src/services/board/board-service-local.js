import { storageService } from "../async-storage-service";
import { loadFromStorage, saveToStorage } from "../util-service";
import boardDataGenerator from "./board-data-generator";
import { USER_STORAGE_KEY } from "../user/user-service-local.js";
import { getFilteredBoard } from "../filter-service";

const BOARDS_STORAGE_KEY = "boardDB";
_createBoards();

export const boardService = {
  query,
  getById,
  remove,
  save,
  updateBoard,
  clearData,
  reCreateBoards,
  getEmptyList,
  copyList,
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

export async function copyList(boardId, listId, newName) {
  try {
    const board = await getById(boardId);
    const originalListIndex = board.lists.findIndex(l => l.id === listId);
    if (originalListIndex === -1) throw new Error("List not found");

    const listToCopy = board.lists[originalListIndex];

    const clonedCards = listToCopy.cards.map(card => ({
      ...card,
      id: crypto.randomUUID(),
    }));

    const clonedList = {
      ...listToCopy,
      id: crypto.randomUUID(),
      name: newName,
      cards: clonedCards,
    };

    // insert the cloned list right after the original list
    const updatedLists = [
      ...board.lists.slice(0, originalListIndex + 1),
      clonedList,
      ...board.lists.slice(originalListIndex + 1),
    ];

    return updatedLists;
  } catch (error) {
    console.error("Error copying list:", error);
    throw error;
  }
}

async function getById(boardId, filterBy = {}) {
  try {
    const board = await storageService.get(BOARDS_STORAGE_KEY, boardId);
    return getFilteredBoard(board, filterBy);
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

export async function updateBoard(
  boardId,
  updates,
  { listId = null, cardId = null } = {}
) {
  try {
    const board = await getById(boardId);

    if (!board) throw new Error("Board not found");

    let updatedBoard;
    if (cardId) {
      updatedBoard = updateCardFields(board, listId, cardId, updates);
    } else if (listId) {
      updatedBoard = updateListFields(board, listId, updates);
    } else {
      updatedBoard = updateBoardFields(board, updates);
    }

    return save(updatedBoard);
  } catch (error) {
    console.error("Cannot update board:", error);

    throw error;
  }
}

// async function updateBoardWithActivity(
//   boardId,
//   { listId = null, cardId = null, key, value }
// ) {
//   try {
//     if (!boardId || !key) throw new Error("Board and key are required");

//     const board = await getById(boardId);
//     if (!board) throw new Error("Board not found");

//     let { board: updatedBoard, prevValue } = _applyBoardUpdate(
//       board,
//       { key, value },
//       listId,
//       cardId
//     );

//     updatedBoard = _addBoardActivity(
//       updatedBoard,
//       key,
//       value,
//       prevValue,
//       listId,
//       cardId
//     );

//     return save(updatedBoard);
//   } catch (error) {
//     console.error("Cannot update board:", error);

//     throw error;
//   }
// }

export function getEmptyList() {
  return {
    id: crypto.randomUUID(),
    name: "",
    cards: [],
  };
}

// function _applyBoardUpdate(
//   board,
//   { key, value },
//   listId = null,
//   cardId = null
// ) {
//   try {
//     let prevValue;

//     if (cardId) {
//       if (!listId) throw new Error("Card update requires listId");

//       const list = board.lists?.find(l => l.id === listId);
//       if (!list) throw new Error("List not found");

//       const card = list.cards?.find(c => c.id === cardId);
//       if (!card) throw new Error("Card not found");

//       if (!key && value) {
//         const index = list.cards.findIndex(c => c.id === cardId);
//         prevValue = card;
//         let newcard = { ...card, ...value };
//         list.cards[index] = newcard;
//       } else {
//         prevValue = card[key];
//         card[key] = value;
//       }
//     } else if (listId) {
//       const list = board.lists?.find(l => l.id === listId);
//       if (!list) throw new Error("List not found");

//       prevValue = list[key];
//       list[key] = value;
//     } else {
//       prevValue = board[key];
//       board[key] = value;
//     }

//     return { board, prevValue };
//   } catch (error) {
//     console.warn("Board updated failed:", error.message);

//     throw error;
//   }
function updateBoardFields(board, updates) {
  return { ...board, ...updates };
}

function updateListFields(board, listId, updates) {
  const listIdx = board.lists?.findIndex(l => l.id === listId);
  if (listIdx === -1 || listIdx == null) throw new Error("List not found");
  const updatedList = { ...board.lists[listIdx], ...updates };
  const updatedLists = [
    ...board.lists.slice(0, listIdx),
    updatedList,
    ...board.lists.slice(listIdx + 1),
  ];
  return updateBoardFields(board, { lists: updatedLists });
}

function updateCardFields(board, listId, cardId, updates) {
  const listIdx = board.lists?.findIndex(l => l.id === listId);
  if (listIdx === -1 || listIdx == null) throw new Error("List not found");
  const list = board.lists[listIdx];
  const cardIdx = list.cards?.findIndex(c => c.id === cardId);
  if (cardIdx === -1 || cardIdx == null) throw new Error("Card not found");
  const updatedCard = { ...list.cards[cardIdx], ...updates };
  const updatedCards = [
    ...list.cards.slice(0, cardIdx),
    updatedCard,
    ...list.cards.slice(cardIdx + 1),
  ];
  const updatedList = { ...list, cards: updatedCards };
  return updateListFields(board, listId, updatedList);
}

/* _applyBoardUpdate removed: logic now handled directly in updateBoard */

// function _addBoardActivity(
//   board,
//   key,
//   value,
//   prevValue,
//   listId = null,
//   cardId = null
// ) {
//   const activity = _createActivity(
//     board._id,
//     key,
//     value,
//     prevValue,
//     listId,
//     cardId
//   );

//   board.activities = board.activities || [];
//   board.activities.unshift(activity);

//   return board;
// }

// function _createActivity(
//   boardId,
//   key,
//   value,
//   prevValue,
//   listId = null,
//   cardId = null
// ) {
//   return {
//     id: makeId(),
//     type: "activity",
//     createdAt: Date.now(),
//     board: boardId,
//     list: listId,
//     card: cardId,
//     key,
//     value,
//     prevValue,
//   };
// }

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
