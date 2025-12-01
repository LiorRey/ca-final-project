import { storageService } from "../async-storage-service";
import { loadFromStorage, saveToStorage } from "../util-service";
import { boardDataGenerator } from "./board-data-generator";
import { USER_STORAGE_KEY } from "../user/user-service-local.js";
import { getFilteredBoard } from "../filter-service";
import {
  calculateNewPosition,
  generatePositionAtEnd,
  sortByPosition,
} from "./fractional-index-service";

const BOARDS_STORAGE_KEY = "boardDB";
_createBoards();

export const boardService = {
  query,
  getById,
  remove,
  save,
  updateBoard,
  getEmptyCard,
  addCard,
  editCard,
  deleteCard,
  copyCard,
  moveCard,
  getEmptyList,
  createList,
  moveList,
  copyList,
  archiveList,
  unarchiveList,
  moveAllCards,
  archiveAllCardsInList,
  updateCardLabels,
  createLabel,
  editLabel,
  deleteLabel,
  getBoardPreviews,
  getBoardListPreviews,
  clearData,
  reCreateBoards,
};
window.bs = boardService;

async function query() {
  try {
    return await storageService.query(BOARDS_STORAGE_KEY);
  } catch (error) {
    console.error("Cannot load boards:", error);

    throw error;
  }
}

async function getById(boardId, filterBy = {}) {
  try {
    const board = await storageService.get(BOARDS_STORAGE_KEY, boardId);

    if (board && board.lists) {
      board.lists = sortByPosition(board.lists);
    }

    return getFilteredBoard(board, filterBy);
  } catch (error) {
    console.error("Cannot get board:", error);

    throw error;
  }
}

async function remove(boardId) {
  try {
    await storageService.remove(BOARDS_STORAGE_KEY, boardId);
  } catch (error) {
    console.error("Cannot remove board:", error);

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
    console.error("Cannot save board:", error);

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

function updateBoardFields(board, updates) {
  return { ...board, ...updates };
}

function updateListFields(board, listId, updates) {
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

function getEmptyCard() {
  return {
    id: crypto.randomUUID(),
    title: "",
    description: "",
    labels: [],
    createdAt: null,
    archivedAt: null,
  };
}

export async function addCard(boardId, listId, card, addCardToEnd = true) {
  try {
    const board = await getById(boardId);
    const list = _findList(board, listId);

    card = { ...card, createdAt: Date.now() };
    if (addCardToEnd) {
      list.cards.push(card);
    } else {
      list.cards.unshift(card);
    }

    await updateBoard(boardId, list, { listId });

    return list;
  } catch (error) {
    console.error("Cannot add card:", error);
    throw error;
  }
}

export async function editCard(boardId, card, listId) {
  try {
    await updateBoard(boardId, card, {
      listId,
      cardId: card.id,
    });
    return { listId, card };
  } catch (error) {
    console.error("Cannot edit card:", error);
    throw error;
  }
}

export async function deleteCard(boardId, cardId, listId) {
  try {
    const board = await getById(boardId);
    const list = _findList(board, listId);
    const cardIdx = _findCardIndex(list, cardId);
    const deletedCard = _findCard(list, cardId);
    list.cards.splice(cardIdx, 1);
    await updateBoard(boardId, list, { listId });
    return deletedCard;
  } catch (error) {
    console.error("Cannot delete card:", error);
    throw error;
  }
}

export async function copyCard(copyData, card) {
  try {
    const {
      destinationBoardId,
      destinationListId,
      keepLabels,
      keepMembers,
      position,
      title,
    } = copyData;

    const board = await getById(destinationBoardId);
    if (!board) throw new Error("Board not found");

    const destinationList = _findList(board, destinationListId);

    const clonedCard = {
      ...card,
      id: crypto.randomUUID(),
      title,
      assignedTo: keepMembers ? card.assignedTo : [],
      labels: keepLabels ? card.labels : [],
    };

    if (position !== null && position !== undefined) {
      destinationList.cards.splice(position, 0, clonedCard);
    } else {
      destinationList.cards.push(clonedCard);
    }

    await updateBoard(destinationBoardId, destinationList, {
      listId: destinationListId,
    });

    return destinationList;
  } catch (error) {
    console.error("Error copying card:", error);
    throw error;
  }
}

export async function moveCard(moveData, card) {
  try {
    const {
      sourceBoardId,
      sourceListId,
      destinationBoardId,
      destinationListId,
      position,
    } = moveData;

    const sourceBoard = await getById(sourceBoardId);
    if (sourceBoardId === destinationBoardId) {
      return moveCardSameBoard(
        sourceBoard,
        sourceListId,
        destinationListId,
        card,
        position
      );
    } else {
      const destinationBoard = await getById(destinationBoardId);
      return moveCardCrossBoard(
        sourceBoard,
        destinationBoard,
        sourceListId,
        destinationListId,
        card,
        position
      );
    }
  } catch (error) {
    console.error("Error moving card:", error);
    throw error;
  }
}

async function moveCardSameBoard(
  board,
  sourceListId,
  targetListId,
  card,
  position
) {
  const sourceList = _findList(board, sourceListId);
  const destinationList = _findList(board, targetListId);
  const cardIndex = _findCardIndex(sourceList, card.id);
  let updatedBoard;

  if (sourceListId === targetListId) {
    const listWithoutCard = removeFromArray(sourceList.cards, cardIndex);
    const listWithCard = insertInArray(listWithoutCard, card, position);
    updatedBoard = updateListFields(board, targetListId, {
      cards: listWithCard,
    });
  } else {
    const listWithoutCard = removeFromArray(sourceList.cards, cardIndex);
    const listWithCard = insertInArray(destinationList.cards, card, position);
    updatedBoard = updateListFields(board, sourceListId, {
      cards: listWithoutCard,
    });
    updatedBoard = updateListFields(updatedBoard, targetListId, {
      cards: listWithCard,
    });
  }

  await save(updatedBoard);

  return updatedBoard.lists;
}

async function moveCardCrossBoard(
  sourceBoard,
  destinationBoard,
  sourceListId,
  targetListId,
  card,
  position
) {
  const sourceList = _findList(sourceBoard, sourceListId);
  const destinationList = _findList(destinationBoard, targetListId);
  const cardIndex = _findCardIndex(sourceList, card.id);
  const listWithoutCard = removeFromArray(sourceList.cards, cardIndex);
  const listWithCard = insertInArray(destinationList.cards, card, position);

  const updatedSrcBoard = updateListFields(sourceBoard, sourceListId, {
    cards: listWithoutCard,
  });

  const updatedDesBoard = updateListFields(destinationBoard, targetListId, {
    cards: listWithCard,
  });

  await save(updatedSrcBoard);
  await save(updatedDesBoard);

  return updatedSrcBoard.lists;
}

export function getEmptyList() {
  return {
    id: crypto.randomUUID(),
    title: "",
    cards: [],
    archivedAt: null,
    position: null,
  };
}

export async function createList(boardId, listData) {
  try {
    const board = await getById(boardId);
    if (!board) throw new Error("Board not found");

    const lastList =
      board.lists.length > 0 ? board.lists[board.lists.length - 1] : null;
    const newPosition = generatePositionAtEnd(lastList?.position || null);

    const newList = {
      ...getEmptyList(),
      ...listData,
      position: newPosition,
    };

    const updatedLists = [...board.lists, newList];
    await updateBoard(boardId, { lists: updatedLists });
    return newList;
  } catch (error) {
    console.error("Cannot create new list:", error);
    throw error;
  }
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

async function moveSameBoard(board, sourceIndex, targetIndex) {
  const movedList = board.lists[sourceIndex];
  if (!movedList) throw new Error("List not found at source index");

  const newPosition = calculateNewPosition(
    board.lists,
    targetIndex,
    movedList.id
  );

  const updatedList = { ...movedList, position: newPosition };

  const updatedLists = board.lists.map(list =>
    list.id === movedList.id ? updatedList : list
  );

  const sortedLists = sortByPosition(updatedLists);

  const updatedBoard = updateBoardFields(board, { lists: sortedLists });
  await save(updatedBoard);

  return updatedList;
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

  const newPosition = calculateNewPosition(targetBoard.lists, targetIndex);

  const updatedList = { ...movedList, position: newPosition };

  const updatedSourceLists = sourceBoard.lists.filter(
    list => list.id !== movedList.id
  );

  const updatedTargetLists = sortByPosition([
    ...targetBoard.lists,
    updatedList,
  ]);

  const updatedSourceBoard = updateBoardFields(sourceBoard, {
    lists: updatedSourceLists,
  });
  const updatedTargetBoard = updateBoardFields(targetBoard, {
    lists: updatedTargetLists,
  });

  await save(updatedSourceBoard);
  await save(updatedTargetBoard);

  return updatedList;
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

    // Calculate position for the cloned list (right after the original)
    const newPosition = calculateNewPosition(
      board.lists,
      originalListIndex + 1
    );

    const clonedList = {
      ...listToCopy,
      id: crypto.randomUUID(),
      title: newName,
      cards: clonedCards,
      position: newPosition,
    };

    // Add the cloned list and sort by position
    const updatedLists = sortByPosition([...board.lists, clonedList]);
    await updateBoard(boardId, { lists: updatedLists });

    return updatedLists;
  } catch (error) {
    console.error("Error copying list:", error);
    throw error;
  }
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

async function archiveAllCardsInList(boardId, listId) {
  try {
    const board = await getById(boardId);
    if (!board) throw new Error("Board not found");

    const list = _findList(board, listId);
    if (!list) throw new Error("List not found");

    list.cards.forEach(card => {
      if (!card.archivedAt) {
        card.archivedAt = Date.now();
      }
    });

    await updateBoard(boardId, board);
    return list;
  } catch (error) {
    console.error("Cannot archive all cards in list:", error);
    throw error;
  }
}

async function updateCardLabels(boardId, listId, cardId, updatedCardLabels) {
  try {
    const board = await getById(boardId);
    if (!board) throw new Error("Board not found");

    await updateBoard(
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

    const updatedLists = board.lists.map(list => ({
      ...list,
      cards: list.cards.map(card => ({
        ...card,
        labels: card.labels.filter(id => id !== labelId),
      })),
    }));

    await updateBoard(boardId, {
      labels: updatedLabels,
      lists: updatedLists,
    });
  } catch (error) {
    console.error("Cannot delete label:", error);
    throw error;
  }
}

/**
 * Retrieves all board names (id and title only)
 * @returns {Promise<Array<{_id: string, title: string}>>}
 */
async function getBoardPreviews() {
  try {
    const boards = await query();
    return boards.map(board => ({
      _id: board._id,
      title: board.title,
    }));
  } catch (error) {
    console.error("Cannot get board names:", error);
    throw error;
  }
}

/**
 * Retrieves lists for a specific board with card counts
 * @param {string} boardId - The board ID
 * @returns {Promise<Array<{id: string, title: string, cardCount: number}>>}
 */
async function getBoardListPreviews(boardId) {
  try {
    const board = await getById(boardId);
    if (!board) throw new Error("Board not found");

    return (board.lists || []).map(list => ({
      id: list.id,
      title: list.title,
      cardCount: list.cards?.length || 0,
    }));
  } catch (error) {
    console.error("Cannot get board lists with card count:", error);
    throw error;
  }
}

// Helper functions used by multiple functions
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

function _findCardIndex(list, cardId) {
  const indx = list.cards?.findIndex(c => c.id === cardId);
  if (indx === -1 || indx == null) throw new Error("Card not found");
  return indx;
}

function removeFromArray(arr, index) {
  return arr.filter((_, idx) => idx !== index);
}

function insertInArray(arr, obj, index) {
  return [...arr.slice(0, index), obj, ...arr.slice(index)];
}

function clearData() {
  saveToStorage(BOARDS_STORAGE_KEY, []);
  saveToStorage(USER_STORAGE_KEY, []);
}

function reCreateBoards() {
  clearData();
  _createBoards();
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
