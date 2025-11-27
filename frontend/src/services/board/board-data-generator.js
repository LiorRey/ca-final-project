import { faker } from "@faker-js/faker";
import {
  generateMultipleUsers,
  generateSampleUsers,
} from "../user/user-data-generator.js";
import { generateInitialPositions } from "./fractional-index-service";

const PROJECT_TYPES = [
  "Project Alpha",
  "Beta Release",
  "Mobile App Development",
  "Website Redesign",
  "API Integration",
  "Database Migration",
  "User Dashboard",
  "E-commerce Platform",
  "Marketing Campaign",
  "Product Launch",
  "Research & Development",
  "Client Portal",
];

const LABEL_OPTIONS = [
  { title: "frontend", color: "blue" },
  { title: "backend", color: "green" },
  { title: "design", color: "purple" },
  { title: "testing", color: "orange" },
  { title: "documentation", color: "gray" },
  { title: "bug", color: "red" },
  { title: "feature", color: "blue" },
  { title: "enhancement", color: "green" },
  { title: "priority:high", color: "red" },
  { title: "priority:medium", color: "yellow" },
  { title: "priority:low", color: "gray" },
  { title: "urgent", color: "red" },
  { title: "review", color: "orange" },
  { title: "blocked", color: "red" },
];

function generateBoardLabels() {
  const numLabels = faker.number.int({ min: 3, max: 8 });
  return faker.helpers
    .arrayElements(LABEL_OPTIONS, numLabels)
    .map(({ title, color }) => ({
      id: crypto.randomUUID(),
      title,
      color,
    }));
}

export function generateCard(
  options = {},
  availableUsers = [],
  boardLabels = []
) {
  const cardId = crypto.randomUUID();
  const createdAt = faker.date.past({ years: 1 }).getTime();

  const numLabels = faker.number.int({ min: 0, max: 4 });
  const labels = boardLabels.length
    ? faker.helpers.arrayElements(
        boardLabels.map(l => l.id),
        numLabels
      )
    : [];

  const numAssignees = faker.number.int({
    min: 0,
    max: Math.min(3, availableUsers.length || 20),
  });
  let assignedTo;

  if (availableUsers.length > 0) {
    const selectedUsers = faker.helpers.arrayElements(
      availableUsers,
      numAssignees
    );
    assignedTo = selectedUsers.map(user => user._id);
  } else {
    assignedTo = Array.from(
      { length: numAssignees },
      () => `user-${faker.number.int({ min: 1, max: 20 })}`
    );
  }

  const dueDate = faker.datatype.boolean({ probability: 0.7 })
    ? faker.date.future({ years: 1 }).getTime()
    : undefined;

  const card = {
    id: cardId,
    title: faker.company.buzzPhrase(),
    description: faker.lorem.sentence({ min: 8, max: 15 }),
    labels,
    assignedTo,
    createdAt,
    archivedAt: null,
    ...(dueDate && { dueDate }),
    ...options,
  };

  return card;
}

export function generateList(
  cardCount = 3,
  options = {},
  availableUsers = [],
  boardLabels = []
) {
  const listNames = [
    "To Do",
    "In Progress",
    "Code Review",
    "Testing",
    "Done",
    "Backlog",
    "Sprint Planning",
    "Development",
    "QA",
    "Deployment",
    "Ideas",
    "Blocked",
    "Waiting for Review",
    "Ready for Production",
  ];

  const cards = Array.from({ length: cardCount }, () =>
    generateCard({}, availableUsers, boardLabels)
  );

  const list = {
    id: crypto.randomUUID(),
    title: faker.helpers.arrayElement(listNames),
    cards,
    archivedAt: null,
    ...options,
  };

  return list;
}

export function generateBoard(listCount = 3, cardsPerList = 3, options = {}) {
  const boardId = crypto.randomUUID();
  const createdAt = faker.date.past({ years: 2 }).getTime();
  const updatedAt = faker.date
    .between({ from: createdAt, to: Date.now() })
    .getTime();

  const boardLabels = generateBoardLabels();

  // Generate fractional positions for all lists
  const positions = generateInitialPositions(listCount);

  const lists = Array.from({ length: listCount }, (_, index) => {
    const cardCount = faker.number.int({ min: 0, max: cardsPerList * 2 });
    return generateList(
      cardCount,
      { position: positions[index] },
      [],
      boardLabels
    );
  });

  const listOrder = lists.map(list => list.id);

  const activities = generateBoardActivities(boardId, lists, 5);

  const board = {
    _id: boardId,
    title: faker.helpers.arrayElement(PROJECT_TYPES),
    description: faker.company.catchPhrase() + " - " + faker.lorem.sentence(),
    createdAt,
    updatedAt,
    labels: boardLabels,
    lists,
    activities,
    listOrder,
    ...options,
  };

  return board;
}

export function generateActivity(
  boardId,
  listId = null,
  cardId = null,
  options = {},
  availableUsers = []
) {
  const activityTypes = [
    "card_created",
    "card_moved",
    "card_updated",
    "card_commented",
    "card_archived",
    "list_created",
    "list_updated",
    "list_archived",
    "board_created",
    "board_updated",
    "board_archived",
  ];
  const type = faker.helpers.arrayElement(activityTypes);

  let byMember;
  if (availableUsers.length > 0) {
    const user = faker.helpers.arrayElement(availableUsers);
    byMember = {
      _id: user._id,
      username: user.username,
      fullname: user.fullname,
    };
  } else {
    byMember = {
      _id: `user-${faker.number.int({ min: 1, max: 20 })}`,
      username: faker.internet.username(),
      fullname: faker.person.fullName(),
    };
  }

  const activity = {
    id: crypto.randomUUID(),
    type: type,
    createdAt: faker.date.recent({ days: 30 }).getTime(),
    byMember,
    board: boardId,
    list: listId,
    card: cardId,
    key: faker.helpers.arrayElement([
      "title",
      "description",
      "status",
      "assignee",
    ]),
    value: faker.lorem.words(3),
    prevValue: faker.lorem.words(2),
    ...options,
  };

  return activity;
}

function generateBoardActivities(
  boardId,
  lists,
  count = 5,
  availableUsers = []
) {
  const activities = [];

  for (let i = 0; i < count; i++) {
    const randomList = faker.helpers.arrayElement(lists);
    const randomCard =
      randomList.cards.length > 0
        ? faker.helpers.arrayElement(randomList.cards)
        : null;

    const activity = generateActivity(
      boardId,
      randomList.id,
      randomCard?.id || null,
      {},
      availableUsers
    );

    activities.push(activity);
  }

  return activities.sort((a, b) => b.createdAt - a.createdAt);
}

export function generateMultipleBoards(count = 5, options = {}) {
  const {
    minLists = 2,
    maxLists = 5,
    minCardsPerList = 1,
    maxCardsPerList = 6,
  } = options;

  return Array.from({ length: count }, () => {
    const listCount = faker.number.int({ min: minLists, max: maxLists });
    const cardsPerList = faker.number.int({
      min: minCardsPerList,
      max: maxCardsPerList,
    });
    return generateBoard(listCount, cardsPerList);
  });
}

export function generateBoardWithUsers(
  listCount = 3,
  cardsPerList = 3,
  options = {}
) {
  const { userCount = 5, includeAdmin = true } = options;

  const users = generateMultipleUsers(userCount, { includeAdmin });

  const boardId = crypto.randomUUID();
  const createdAt = faker.date.past({ years: 2 }).getTime();
  const updatedAt = faker.date
    .between({ from: createdAt, to: Date.now() })
    .getTime();

  const owner = faker.helpers.arrayElement(users);

  const boardLabels = generateBoardLabels();

  // Generate fractional positions for all lists
  const positions = generateInitialPositions(listCount);

  const lists = Array.from({ length: listCount }, (_, index) => {
    const cardCount = faker.number.int({ min: 0, max: cardsPerList * 2 });
    return generateList(
      cardCount,
      { position: positions[index] },
      users,
      boardLabels
    );
  });

  const listOrder = lists.map(list => list.id);

  const activities = generateBoardActivities(boardId, lists, 8, users);

  const board = {
    _id: boardId,
    title: faker.helpers.arrayElement(PROJECT_TYPES),
    description: faker.company.catchPhrase() + " - " + faker.lorem.sentence(),
    createdAt,
    updatedAt,
    labels: boardLabels,
    createdBy: {
      _id: owner._id,
      username: owner.username,
      fullname: owner.fullname,
    },
    members: users.map(user => ({
      _id: user._id,
      username: user.username,
      fullname: user.fullname,
      imgUrl: user.imgUrl,
      role:
        user._id === owner._id ? "owner" : user.isAdmin ? "admin" : "member",
      joinedAt: faker.date
        .between({ from: createdAt, to: updatedAt })
        .getTime(),
    })),
    lists,
    activities,
    listOrder,
    ...options,
  };

  return { board, users };
}

export function generateMultipleBoardsWithUsers(count = 5, options = {}) {
  const {
    minLists = 2,
    maxLists = 5,
    minCardsPerList = 1,
    maxCardsPerList = 6,
    userCount = 5,
    sharedUsers = false,
  } = options;

  let sharedUserPool = [];
  if (sharedUsers) {
    sharedUserPool = generateMultipleUsers(15, { includeAdmin: true });
  }

  return Array.from({ length: count }, () => {
    const listCount = faker.number.int({ min: minLists, max: maxLists });
    const cardsPerList = faker.number.int({
      min: minCardsPerList,
      max: maxCardsPerList,
    });

    if (sharedUsers) {
      const boardUsers = faker.helpers.arrayElements(
        sharedUserPool,
        faker.number.int({ min: 3, max: Math.min(8, sharedUserPool.length) })
      );

      const board = generateBoard(listCount, cardsPerList, options);

      const owner = faker.helpers.arrayElement(boardUsers);
      board.createdBy = {
        _id: owner._id,
        username: owner.username,
        fullname: owner.fullname,
      };
      board.members = boardUsers.map(user => ({
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        imgUrl: user.imgUrl,
        role:
          user._id === owner._id ? "owner" : user.isAdmin ? "admin" : "member",
        joinedAt: faker.date
          .between({
            from: board.createdAt,
            to: board.updatedAt,
          })
          .getTime(),
      }));

      // Generate fractional positions for all lists
      const positions = generateInitialPositions(listCount);
      board.lists = Array.from({ length: listCount }, (_, index) => {
        const cardCount = faker.number.int({ min: 0, max: cardsPerList * 2 });
        return generateList(
          cardCount,
          { position: positions[index] },
          boardUsers,
          board.labels
        );
      });
      board.activities = generateBoardActivities(
        board._id,
        board.lists,
        8,
        boardUsers
      );

      return { board, users: boardUsers };
    } else {
      return generateBoardWithUsers(listCount, cardsPerList, {
        ...options,
        userCount,
      });
    }
  });
}

export function generateSampleData() {
  const { allUsers, adminUser, testUser, regularUsers } = generateSampleUsers();

  const { board: sampleBoard } = generateBoardWithUsers(4, 4, {
    title: "Sample Development Board",
    description: "A comprehensive sample board for development and testing",
    userCount: 6,
  });

  const multipleBoardsData = generateMultipleBoardsWithUsers(3, {
    minLists: 3,
    maxLists: 6,
    minCardsPerList: 2,
    maxCardsPerList: 5,
    userCount: 5,
  });

  return {
    sampleBoard,
    sampleUsers: allUsers,
    sampleBoards: multipleBoardsData.map(data => data.board),
    allUsers,
    adminUser,
    testUser,
    regularUsers,
    sampleCard: generateCard(
      {
        title: "Sample Task",
        description: "This is a sample card for testing purposes",
      },
      allUsers
    ),
    sampleList: generateList(
      4,
      {
        title: "Sample List",
      },
      allUsers
    ),
  };
}

export const boardDataGenerator = {
  generateCard,
  generateList,
  generateBoard,
  generateActivity,
  generateMultipleBoards,
  generateBoardWithUsers,
  generateMultipleBoardsWithUsers,
  generateSampleData,
};
