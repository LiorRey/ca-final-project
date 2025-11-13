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
  moveList,
  clearData,
  reCreateBoards,
  addCard,
  editCard,
  deleteCard,
  getEmptyList,
  copyList,
  moveAllCards,
  createList,
  createLabel,
  editLabel,
  deleteLabel,
  updateCardLabels,
  archiveList,
  unarchiveList,
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
      title: newName,
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

function removeListFromArray(lists, index) {
  return lists.filter((_, idx) => idx !== index);
}

function insertListInArray(lists, list, index) {
  return [...lists.slice(0, index), list, ...lists.slice(index)];
}

async function moveSameBoard(board, sourceIndex, targetIndex) {
  const movedList = board.lists[sourceIndex];
  if (!movedList) throw new Error("List not found at source index");

  const listsWithoutMoved = removeListFromArray(board.lists, sourceIndex);
  const updatedLists = insertListInArray(
    listsWithoutMoved,
    movedList,
    targetIndex
  );

  const updatedBoard = updateBoardFields(board, { lists: updatedLists });
  await save(updatedBoard);

  return updatedLists;
}

async function moveCrossBoard(
  sourceBoard,
  targetBoard,
  sourceIndex,
  targetIndex,
  currentBoardId
) {
  const movedList = sourceBoard.lists[sourceIndex];
  if (!movedList) throw new Error("List not found at source index");

  const updatedSourceLists = removeListFromArray(
    sourceBoard.lists,
    sourceIndex
  );
  const updatedTargetLists = insertListInArray(
    targetBoard.lists,
    movedList,
    targetIndex
  );

  const updatedSourceBoard = updateBoardFields(sourceBoard, {
    lists: updatedSourceLists,
  });
  const updatedTargetBoard = updateBoardFields(targetBoard, {
    lists: updatedTargetLists,
  });

  await save(updatedSourceBoard);
  await save(updatedTargetBoard);

  return currentBoardId === sourceBoard._id
    ? updatedSourceLists
    : updatedTargetLists;
}

export async function moveList(
  sourceBoardId,
  sourceIndex,
  targetIndex,
  targetBoardId,
  currentBoardId
) {
  try {
    if (sourceBoardId === targetBoardId) {
      const board = await getById(sourceBoardId);
      if (!board) throw new Error("Board not found");
      return await moveSameBoard(board, sourceIndex, targetIndex);
    } else {
      const sourceBoard = await getById(sourceBoardId);
      const targetBoard = await getById(targetBoardId);
      if (!sourceBoard || !targetBoard) throw new Error("Board not found");
      return await moveCrossBoard(
        sourceBoard,
        targetBoard,
        sourceIndex,
        targetIndex,
        currentBoardId
      );
    }
  } catch (error) {
    console.error("Error moving list:", error);
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

export async function moveAllCards(
  boardId,
  sourceListId,
  targetListId = null,
  { newListTitle = "New List" } = {}
) {
  try {
    const board = await getById(boardId);
    if (!board) throw new Error("Board not found");

    const sourceList = _findList(board, sourceListId);
    const cardsToMove = [...sourceList.cards];

    let targetList;
    let updatedLists;

    if (!targetListId) {
      const newList = {
        ...getEmptyList(),
        title: newListTitle,
        cards: cardsToMove,
      };
      updatedLists = [...board.lists, newList];
    } else {
      targetList = _findList(board, targetListId);
      targetList.cards.push(...cardsToMove);
      updatedLists = board.lists;
    }

    sourceList.cards = [];
    const updatedBoard = await updateBoard(boardId, { lists: updatedLists });
    return updatedBoard.lists;
  } catch (error) {
    console.error("Cannot move all cards:", error);
    throw error;
  }
}

export async function createList(boardId, listData) {
  try {
    const board = await getById(boardId);
    if (!board) throw new Error("Board not found");

    const newList = {
      ...getEmptyList(),
      ...listData,
    };

    const updatedLists = [...board.lists, newList];
    await updateBoard(boardId, { lists: updatedLists });
    return newList;
  } catch (error) {
    console.error("Cannot create new list:", error);
    throw error;
  }
}

export function getEmptyList() {
  return {
    id: crypto.randomUUID(),
    title: "",
    cards: [],
    archivedAt: null,
  };
}

async function updateListArchiveStatus(boardId, listId, archivedAt) {
  const board = await getById(boardId);
  const list = _findList(board, listId);

  if (archivedAt && list.archivedAt) {
    throw new Error("List is already archived");
  }
  if (!archivedAt && !list.archivedAt) {
    throw new Error("List is not archived");
  }

  const updatedList = { ...list, archivedAt };
  await updateBoard(boardId, { archivedAt }, { listId });
  return updatedList;
}

export async function archiveList(boardId, listId) {
  try {
    return await updateListArchiveStatus(boardId, listId, Date.now());
  } catch (error) {
    console.error("Cannot archive list:", error);
    throw error;
  }
}

export async function unarchiveList(boardId, listId) {
  try {
    return await updateListArchiveStatus(boardId, listId, null);
  } catch (error) {
    console.error("Cannot unarchive list:", error);
    throw error;
  }
}

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

async function createLabel(boardId, label) {
  try {
    const board = await getById(boardId);
    if (!board) throw new Error("Board not found");

    await updateBoard(boardId, { labels: [...board.labels, label] });
  } catch (error) {
    console.error("Cannot create label:", error);
    throw error;
  }
}

async function editLabel(boardId, label) {
  try {
    const board = await getById(boardId);
    if (!board) throw new Error("Board not found");

    const updatedLabels = board.labels.map(l =>
      l.id === label.id ? label : l
    );

    await updateBoard(boardId, { labels: updatedLabels });
  } catch (error) {
    console.error("Cannot edit label:", error);
    throw error;
  }
}

async function deleteLabel(boardId, labelId) {
  try {
    const board = await getById(boardId);
    if (!board) throw new Error("Board not found");

    const updatedLabels = board.labels.filter(l => l.id !== labelId);

    await updateBoard(boardId, { labels: updatedLabels });
  } catch (error) {
    console.error("Cannot delete label:", error);
    throw error;
  }
}

async function updateCardLabels(boardId, listId, cardId, updatedCardLabels) {
  try {
    const board = await getById(boardId);
    if (!board) throw new Error("Board not found");

    const updatedBoard = await updateBoard(
      boardId,
      { labels: updatedCardLabels },
      {
        listId,
        cardId,
      }
    );

    return updatedCardLabels;
  } catch (error) {
    console.error("Cannot update card labels:", error);
    throw error;
  }
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
