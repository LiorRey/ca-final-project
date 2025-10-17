import { storageService } from "../async-storage-service";
import { loadFromStorage, makeId, saveToStorage } from "../util-service";

const BOARDS_STORAGE_KEY = "boardDB";
_createBoards();

export const boardService = {
  query,
  getById,
  remove,
  updateBoardWithActivity,
};
window.cs = boardService;

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
  { key, value },
  listId = null,
  cardId = null
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

    return _save(updatedBoard);
  } catch (error) {
    console.error("Cannot update board:", error);

    throw error;
  }
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

async function _save(board) {
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
    boards = [];
    boards.push(_createBoard());

    saveToStorage(BOARDS_STORAGE_KEY, boards);
  }
}

function _createBoard() {
  return {
    id: makeId(),
    type: "board",
    name: "Project Alpha",
    description: "Main development board for Project Alpha",
    createdAt: "1760391084016",
    updatedAt: "1760391111653",
    lists: [
      {
        id: makeId(),
        type: "list",
        name: "To Do",
        cards: [
          {
            id: makeId(),
            title: "Set up project repo",
            description: "Initialize repository and push base structure",
            labels: [
              { name: "frontend", color: "blue" },
              { name: "priority:high", color: "green" },
            ],
            assignedTo: ["user-1"],
            createdAt: "1760391124118",
            dueDate: "1760391142172",
          },
          {
            id: makeId(),
            title: "Define API endpoints",
            description: "Draft a list of REST endpoints for backend",
            labels: [{ name: "frontend", color: "blue" }],
            assignedTo: ["user-2"],
            createdAt: "1760391148666",
          },
        ],
      },
      {
        id: makeId(),
        type: "list",
        name: "In Progress",
        cards: [
          {
            id: makeId(),
            title: "Design login page",
            description: "Create wireframe for login and register screens",
            labels: [
              { name: "backend", color: "blue" },
              { name: "priority:high", color: "red" },
            ],
            assignedTo: ["user-3"],
            createdAt: "1760391156864",
          },
        ],
      },
      {
        id: makeId(),
        type: "list",
        name: "Done",
        cards: [],
      },
      // New demo lists
      {
        id: makeId(),
        type: "list",
        name: "Review",
        cards: [
          {
            id: makeId(),
            title: "Code review login feature",
            description: "Review pull request #12",
            labels: [{ name: "backend", color: "yellow" }],
            assignedTo: ["user-4"],
            createdAt: "1760391200000",
          },
          {
            id: makeId(),
            title: "Review API endpoints",
            description: "Check REST endpoints documentation",
            labels: [{ name: "frontend", color: "blue" }],
            assignedTo: ["user-2"],
            createdAt: "1760391210000",
          },
          {
            id: makeId(),
            title: "UI/UX review",
            description: "Check design consistency",
            labels: [{ name: "design", color: "purple" }],
            assignedTo: ["user-5"],
            createdAt: "1760391220000",
          },
        ],
      },
      {
        id: makeId(),
        type: "list",
        name: "Blocked",
        cards: [
          {
            id: makeId(),
            title: "Waiting for API approval",
            description: "Cannot proceed until backend confirms endpoints",
            labels: [{ name: "backend", color: "red" }],
            assignedTo: ["user-3"],
            createdAt: "1760391230000",
          },
        ],
      },
      {
        id: makeId(),
        type: "list",
        name: "Ideas",
        cards: [
          {
            id: makeId(),
            title: "New dashboard layout",
            description: "Sketch initial dashboard ideas",
            labels: [{ name: "design", color: "purple" }],
            assignedTo: ["user-5"],
            createdAt: "1760391240000",
          },
          {
            id: makeId(),
            title: "Integrate notifications",
            description: "Consider push notifications for events",
            labels: [{ name: "frontend", color: "blue" }],
            assignedTo: ["user-1"],
            createdAt: "1760391250000",
          },
        ],
      },
    ],
    activities: [
      {
        id: makeId(),
        type: "activity",
        activityType: "card_created",
        userId: "user-1",
        cardId: "card-12",
        message: "User created card 'Set up project repo' in 'To Do'",
        previousData: null,
        currentData: {
          id: "card-12",
          title: "Set up project repo",
          listId: "list-1",
        },
        timestamp: "1760391167252",
      },
      {
        id: makeId(),
        type: "activity",
        activityType: "card_created",
        userId: "user-2",
        cardId: "card-13",
        message: "User created card 'Define API endpoints' in 'To Do'",
        previousData: null,
        currentData: {
          id: "card-13",
          title: "Define API endpoints",
          listId: "list-1",
        },
        timestamp: "1760391185949",
      },
      {
        id: makeId(),
        type: "activity",
        activityType: "card_created",
        userId: "user-3",
        cardId: "card-7",
        message: "User created card 'Design login page' in 'In Progress'",
        previousData: null,
        currentData: {
          id: "card-7",
          title: "Design login page",
          listId: "list-4",
        },
        timestamp: "1760391195759",
      },
      // New activities for "Review" list
      {
        id: makeId(),
        type: "activity",
        activityType: "card_created",
        userId: "user-4",
        cardId: "card-21",
        message: "User created card 'Code review login feature' in 'Review'",
        previousData: null,
        currentData: {
          id: "card-21",
          title: "Code review login feature",
          listId: "list-5",
        },
        timestamp: "1760391260000",
      },
      {
        id: makeId(),
        type: "activity",
        activityType: "card_created",
        userId: "user-2",
        cardId: "card-22",
        message: "User created card 'Review API endpoints' in 'Review'",
        previousData: null,
        currentData: {
          id: "card-22",
          title: "Review API endpoints",
          listId: "list-5",
        },
        timestamp: "1760391270000",
      },
      {
        id: makeId(),
        type: "activity",
        activityType: "card_created",
        userId: "user-5",
        cardId: "card-23",
        message: "User created card 'UI/UX review' in 'Review'",
        previousData: null,
        currentData: {
          id: "card-23",
          title: "UI/UX review",
          listId: "list-5",
        },
        timestamp: "1760391280000",
      },
      // Activity for "Blocked" list
      {
        id: makeId(),
        type: "activity",
        activityType: "card_created",
        userId: "user-3",
        cardId: "card-31",
        message: "User created card 'Waiting for API approval' in 'Blocked'",
        previousData: null,
        currentData: {
          id: "card-31",
          title: "Waiting for API approval",
          listId: "list-6",
        },
        timestamp: "1760391290000",
      },
      // Activities for "Ideas" list
      {
        id: makeId(),
        type: "activity",
        activityType: "card_created",
        userId: "user-5",
        cardId: "card-41",
        message: "User created card 'New dashboard layout' in 'Ideas'",
        previousData: null,
        currentData: {
          id: "card-41",
          title: "New dashboard layout",
          listId: "list-7",
        },
        timestamp: "1760391300000",
      },
      {
        id: makeId(),
        type: "activity",
        activityType: "card_created",
        userId: "user-1",
        cardId: "card-42",
        message: "User created card 'Integrate notifications' in 'Ideas'",
        previousData: null,
        currentData: {
          id: "card-42",
          title: "Integrate notifications",
          listId: "list-7",
        },
        timestamp: "1760391310000",
      },
    ],
    listOrder: ["list-1", "list-4", "list-3", "list-5", "list-6", "list-7"],
  };
}
