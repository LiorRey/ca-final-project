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
  return await storageService.query(BOARDS_STORAGE_KEY);
}

function getById(boardId) {
  let board = null;

  try {
    board = storageService.get(BOARDS_STORAGE_KEY, boardId);
  } catch (error) {
    console.log("Cannot get board:", error);
  }

  return board;
}

async function save(board) {
  let savedBoard = null;

  try {
    const boardToSave = { ...board };

    if (board._id) {
      savedBoard = await storageService.put(BOARDS_STORAGE_KEY, boardToSave);
    } else {
      savedBoard = await storageService.post(BOARDS_STORAGE_KEY, boardToSave);
    }

    return savedBoard;
  } catch (error) {
    console.log("Cannot save board:", error);
  }
}

async function updateBoard(board, listId, cardId, { key, value }) {
  let prevValue = "";
  let activity = {};

  try {
    if (!board || !key) throw "No board or key provided";

    const listIndex = board.lists.findIndex(list => list.id === listId);
    if (listIndex !== -1) {
      const cardIndex = board.lists[listIndex].cards.findIndex(
        card => card.id === cardId
      );

      if (cardIndex !== -1) {
        // Update a Card field
        prevValue = board.lists[listIndex].cards[cardIndex][key];
        board.lists[listIndex].cards[cardIndex][key] = value;
      } else {
        // Update a List field
        prevValue = board.lists[listIndex][key];
        board.lists[listIndex][key] = value;
      }
    } else {
      // Update a Board field
      prevValue = board[key];
      board[key] = value;
    }
  } catch (error) {
    console.log("Cannot save board:", error);
  } finally {
    if (board && key) {
      activity = createActivity(
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
    ],
    activities: [
      {
        id: "activity-1",
        type: "card_created",
        userId: "user-1",
        cardId: "card-1",
        message: "User created card 'Set up project repo' in 'To Do'",
        previousData: null,
        currentData: {
          id: "card-1",
          title: "Set up project repo",
          listId: "list-1",
        },
        timestamp: "1760391167252",
      },
      {
        id: "activity-2",
        type: "card_moved",
        userId: "user-2",
        cardId: "card-3",
        message: "User moved 'Design login page' from 'To Do' to 'In Progress'",
        previousData: { listId: "list-1" },
        currentData: { listId: "list-2" },
        timestamp: "1760391185949",
      },
      {
        id: "activity-3",
        type: "card_updated",
        userId: "user-3",
        cardId: "card-2",
        message: "User changed description of 'Define API endpoints'",
        previousData: { description: "Draft API" },
        currentData: {
          description: "Draft a list of REST endpoints for backend",
        },
        timestamp: "1760391195759",
      },
    ],
    listOrder: ["list-1", "list-4", "list-3"],
  };
}
