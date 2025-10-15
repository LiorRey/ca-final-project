import { storageService } from "../async-storage-service";
import { loadFromStorage, makeId, saveToStorage } from "../util-service";

const BOARDS_STORAGE_KEY = "boardDB";
_createBoards();

export const boardService = {
  query,
  getById,
  save,
  updateBoard,
  remove,
  createActivity,
};
window.cs = boardService;

async function query() {
  try {
    return await storageService.query(BOARDS_STORAGE_KEY);
  } catch (error) {
    console.log("Cannot load boards:", error);
    return null;
  }
}

function getById(boardId) {
  try {
    return storageService.get(BOARDS_STORAGE_KEY, boardId);
  } catch (error) {
    console.log("Cannot get board:", error);
    return null;
  }
}

async function save(board) {
  try {
    if (board._id) {
      return await storageService.put(BOARDS_STORAGE_KEY, { ...board });
    } else {
      return await storageService.post(BOARDS_STORAGE_KEY, { ...board });
    }
  } catch (error) {
    console.log("Cannot save board:", error);
    return null;
  }
}

async function updateBoard(board, listId, cardId, { key, value }) {
  let prevValue;

  try {
    if (!board || !key) throw new Error("No board or key provided");

    const list = board.lists?.find(l => l.id === listId);
    if (list) {
      const card = list.cards?.find(c => c.id === cardId);

      if (card) {
        // Update a Card field
        prevValue = card[key];
        card[key] = value;
      } else {
        // Update a List field
        prevValue = list[key];
        list[key] = value;
      }
    } else {
      // Update a Board field
      prevValue = board[key];
      board[key] = value;
    }
  } catch (error) {
    console.log("Cannot update board:", error);
  } finally {
    if (board && key) {
      const activity = createActivity(
        board._id,
        listId || null,
        cardId || null,
        key,
        value,
        prevValue
      );

      board.activities = board.activities || [];
      board.activities.unshift(activity);
    }
  }

  return board;
}

async function remove(boardId) {
  try {
    await storageService.remove(BOARDS_STORAGE_KEY, boardId);
  } catch (error) {
    console.log("Cannot remove board:", error);
  }
}

function createActivity(boardId, listId, cardId, key, value, prevValue) {
  return {
    id: `a-${makeId()}`,
    createdAt: Date.now(),
    // byMember: { username: 'logged-user' },
    board: boardId,
    list: listId,
    card: cardId,
    key,
    value,
    prevValue,
  };
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
    id: `b-${makeId()}`,
    name: "Project Alpha",
    description: "Main development board for Project Alpha",
    createdAt: "1760391084016",
    updatedAt: "1760391111653",
    lists: [
      {
        id: "list-1",
        name: "To Do",
        cards: [
          {
            id: "card-12",
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
            id: "card-13",
            title: "Define API endpoints",
            description: "Draft a list of REST endpoints for backend",
            labels: [{ name: "frontend", color: "blue" }],
            assignedTo: ["user-2"],
            createdAt: "1760391148666",
          },
        ],
      },
      {
        id: "list-4",
        name: "In Progress",
        cards: [
          {
            id: "card-7",
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
        id: "list-3",
        name: "Done",
        cards: [],
      },
      // New demo lists
      {
        id: "list-5",
        name: "Review",
        cards: [
          {
            id: "card-21",
            title: "Code review login feature",
            description: "Review pull request #12",
            labels: [{ name: "backend", color: "yellow" }],
            assignedTo: ["user-4"],
            createdAt: "1760391200000",
          },
          {
            id: "card-22",
            title: "Review API endpoints",
            description: "Check REST endpoints documentation",
            labels: [{ name: "frontend", color: "blue" }],
            assignedTo: ["user-2"],
            createdAt: "1760391210000",
          },
          {
            id: "card-23",
            title: "UI/UX review",
            description: "Check design consistency",
            labels: [{ name: "design", color: "purple" }],
            assignedTo: ["user-5"],
            createdAt: "1760391220000",
          },
        ],
      },
      {
        id: "list-6",
        name: "Blocked",
        cards: [
          {
            id: "card-31",
            title: "Waiting for API approval",
            description: "Cannot proceed until backend confirms endpoints",
            labels: [{ name: "backend", color: "red" }],
            assignedTo: ["user-3"],
            createdAt: "1760391230000",
          },
        ],
      },
      {
        id: "list-7",
        name: "Ideas",
        cards: [
          {
            id: "card-41",
            title: "New dashboard layout",
            description: "Sketch initial dashboard ideas",
            labels: [{ name: "design", color: "purple" }],
            assignedTo: ["user-5"],
            createdAt: "1760391240000",
          },
          {
            id: "card-42",
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
        id: "activity-1",
        type: "card_created",
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
        id: "activity-2",
        type: "card_created",
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
        id: "activity-3",
        type: "card_created",
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
        id: "activity-4",
        type: "card_created",
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
        id: "activity-5",
        type: "card_created",
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
        id: "activity-6",
        type: "card_created",
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
        id: "activity-7",
        type: "card_created",
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
        id: "activity-8",
        type: "card_created",
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
        id: "activity-9",
        type: "card_created",
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
