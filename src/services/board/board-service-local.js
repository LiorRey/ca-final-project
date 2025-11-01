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
  addCard,
  editCard,
  deleteCard,
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
    // debug logs
    console.log("boardId", boardId);
    console.log("updates", updates);
    console.log("listId", listId);
    console.log("cardId", cardId);
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

export async function addCard(boardId, card, listId) {
  try {
    const board = await getById(boardId);
    if (!board) throw new Error("Board not found");
    const list = _findList(board, listId);
    const newCard = { ...getEmptyCard(), ...card };
    list.cards.push(newCard);
    const updatedBoard = await updateBoard(boardId, list, listId);
    return newCard;
  } catch (error) {
    console.error("Cannot add card:", error);
    throw error;
  }
}

export async function editCard(boardId, card, listId) {
  try {
    const board = await getById(boardId);
    if (!board) throw new Error("Board not found");
    const updatedBoard = await updateBoard(boardId, card, {
      listId,
      cardId: card.id,
    });
    return card;
  } catch (error) {
    console.error("Cannot edit card:", error);
    throw error;
  }
}

export async function deleteCard(boardId, cardId, listId) {
  try {
    const board = await getById(boardId);
    if (!board) throw new Error("Board not found");
    const list = _findList(board, listId);
    const cardIdx = _findCardIndex(list, cardId);
    const deletedCard = _findCard(list, cardId);
    list.cards.splice(cardIdx, 1);
    const updatedBoard = await updateBoard(boardId, list, { listId });
    return deletedCard; // return the deleted card
  } catch (error) {
    console.error("Cannot delete card:", error);
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
  console.log("updates", updates);
  const list = _findList(board, listId);
  const updatedList = { ...list, ...updates };
  const updatedLists = board.lists.map(list =>
    list.id === listId ? updatedList : list
  );
  return updateBoardFields(board, { lists: updatedLists });
}

function updateCardFields(board, listId, cardId, updates) {
  const list = _findList(board, listId);
  const card = _findCard(list, cardId);
  const updatedCard = { ...card, ...updates };
  const updatedCards = list.cards.map(card =>
    card.id === cardId ? updatedCard : card
  );
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

function _findListIndex(board, listId) {
  const indx = board.lists?.findIndex(l => l.id === listId);
  if (indx === -1 || indx == null) throw new Error("List not found");
  return indx;
}

function _findCardIndex(list, cardId) {
  const indx = list.cards?.findIndex(c => c.id === cardId);
  if (indx === -1 || indx == null) throw new Error("Card not found");
  return indx;
}

function _findList(board, listId) {
  const list = board.lists?.find(l => l.id === listId);
  if (!list) throw new Error("List not found");
  return list;
}

function _findCard(list, cardId) {
  const card = list.cards?.find(c => c.id === cardId);
  if (!card) throw new Error("Card not found");
  return card;
}
