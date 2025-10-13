import { storageService } from "../async-storage-service";
import { makeId } from "../util-service";
import { userService } from "../user";

const STORAGE_KEY = "car";

const boardObject = {
  id: "board-1",
  name: "Project Alpha",
  description: "Main development board for Project Alpha",
  createdAt: "2025-10-12T10:00:00Z",
  updatedAt: "2025-10-12T16:00:00Z",
  lists: [
    {
      id: "list-1",
      name: "To Do",
      position: 1,
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
          createdAt: "2025-10-12T10:05:00Z",
          dueDate: "2025-10-15T00:00:00Z",
        },
        {
          id: "card-13",
          title: "Define API endpoints",
          description: "Draft a list of REST endpoints for backend",
          labels: [{ name: "frontend", color: "blue" }],
          assignedTo: ["user-2"],
          createdAt: "2025-10-12T11:00:00Z",
        },
      ],
    },
    {
      id: "list-2",
      name: "Backlog Tasks",
      position: 2,
      cards: [
        {
          id: "card-11",
          title: "Design login page",
          description: "Create wireframe for login and register screens",
          labels: [
            { name: "frontend", color: "green" },
            { name: "priority:high", color: "red" },
            { name: "urgent", color: "red" },
          ],
          assignedTo: ["user-3"],
          createdAt: "2025-10-12T09:30:00Z",
        },
        {
          id: "card-10",
          title: "Set up project repo",
          description: "Initialize repository and push base structure",
          labels: [
            { name: "frontend", color: "blue" },
            { name: "priority:low", color: "green" },
          ],
          assignedTo: ["user-1"],
          createdAt: "2025-10-12T10:05:00Z",
          dueDate: "2025-10-15T00:00:00Z",
        },
        {
          id: "card-9",
          title: "Define API endpoints",
          description: "Draft a list of REST endpoints for backend",
          labels: [
            { name: "frontend", color: "blue" },
            { name: "priority:high", color: "red" },
          ],
          assignedTo: ["user-2"],
          createdAt: "2025-10-12T11:00:00Z",
        },
        {
          id: "card-4",
          title: "Set up project repo",
          description: "Initialize repository and push base structure",
          labels: [{ name: "priority:high", color: "red" }],
          assignedTo: ["user-1"],
          createdAt: "2025-10-12T10:05:00Z",
          dueDate: "2025-10-15T00:00:00Z",
        },
        {
          id: "card-11",
          title: "Design login page",
          description: "Create wireframe for login and register screens",
          labels: [
            { name: "frontend", color: "green" },
            { name: "priority:high", color: "red" },
            { name: "urgent", color: "red" },
          ],
          assignedTo: ["user-3"],
          createdAt: "2025-10-12T09:30:00Z",
        },
        {
          id: "card-11",
          title: "Design login page",
          description: "Create wireframe for login and register screens",
          labels: [
            { name: "frontend", color: "green" },
            { name: "priority:high", color: "red" },
            { name: "urgent", color: "red" },
          ],
          assignedTo: ["user-3"],
          createdAt: "2025-10-12T09:30:00Z",
        },
        {
          id: "card-11",
          title: "Design login page",
          description: "Create wireframe for login and register screens",
          labels: [
            { name: "frontend", color: "green" },
            { name: "priority:high", color: "red" },
            { name: "urgent", color: "red" },
          ],
          assignedTo: ["user-3"],
          createdAt: "2025-10-12T09:30:00Z",
        },
      ],
    },
    {
      id: "list-3",
      name: "In Progress",
      position: 2,
      cards: [
        {
          id: "card-8",
          title: "Design login page",
          description: "Create wireframe for login and register screens",
          labels: [
            { name: "backend", color: "blue" },
            { name: "priority:high", color: "red" },
          ],
          assignedTo: ["user-3"],
          createdAt: "2025-10-12T09:30:00Z",
        },
        {
          id: "card-1",
          title: "Set up project repo",
          description: "Initialize repository and push base structure",
          labels: [
            { name: "frontend", color: "blue" },
            { name: "priority:low", color: "green" },
          ],
          assignedTo: ["user-1"],
          createdAt: "2025-10-12T10:05:00Z",
          dueDate: "2025-10-15T00:00:00Z",
        },
        {
          id: "card-2",
          title: "Define API endpoints",
          description: "Draft a list of REST endpoints for backend",
          labels: [
            { name: "frontend", color: "blue" },
            { name: "priority:high", color: "red" },
          ],
          assignedTo: ["user-2"],
          createdAt: "2025-10-12T11:00:00Z",
        },
      ],
    },
    {
      id: "list-3",
      name: "Done",
      position: 3,
      cards: [],
    },
    {
      id: "list-4",
      name: "In Progress",
      position: 2,
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
          createdAt: "2025-10-12T09:30:00Z",
        },
        {
          id: "card-6",
          title: "Set up project repo",
          description: "Initialize repository and push base structure",
          labels: [
            { name: "frontend", color: "blue" },
            { name: "priority:low", color: "green" },
          ],
          assignedTo: ["user-1"],
          createdAt: "2025-10-12T10:05:00Z",
          dueDate: "2025-10-15T00:00:00Z",
        },
        {
          id: "card-5",
          title: "Define API endpoints",
          description: "Draft a list of REST endpoints for backend",
          labels: [
            { name: "frontend", color: "blue" },
            { name: "priority:high", color: "red" },
          ],
          assignedTo: ["user-2"],
          createdAt: "2025-10-12T11:00:00Z",
        },
      ],
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
      timestamp: "2025-10-12T10:05:10Z",
    },
    {
      id: "activity-2",
      type: "card_moved",
      userId: "user-2",
      cardId: "card-3",
      message: "User moved 'Design login page' from 'To Do' to 'In Progress'",
      previousData: { listId: "list-1" },
      currentData: { listId: "list-2" },
      timestamp: "2025-10-12T11:45:00Z",
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
      timestamp: "2025-10-12T13:10:00Z",
    },
  ],
  users: [
    {
      id: "user-1",
      name: "Alice",
      avatar: "https://example.com/alice.png",
    },
    {
      id: "user-2",
      name: "Bob",
      avatar: "https://example.com/bob.png",
    },
    {
      id: "user-3",
      name: "Charlie",
      avatar: "https://example.com/charlie.png",
    },
  ],
};

export const carService = {
  query,
  getById,
  save,
  remove,
  addCarMsg,
  getBoardObject,
};
window.cs = carService;

function getBoardObject() {
  return boardObject;
}

async function query(filterBy = { txt: "", minSpeed: 0 }) {
  var cars = await storageService.query(STORAGE_KEY);
  const { txt, minSpeed, sortField, sortDir } = filterBy;

  if (txt) {
    const regex = new RegExp(filterBy.txt, "i");
    cars = cars.filter(
      car => regex.test(car.vendor) || regex.test(car.description)
    );
  }
  if (minSpeed) {
    cars = cars.filter(car => car.speed >= minSpeed);
  }
  if (sortField === "vendor") {
    cars.sort(
      (car1, car2) => car1[sortField].localeCompare(car2[sortField]) * +sortDir
    );
  }
  if (sortField === "speed") {
    cars.sort((car1, car2) => (car1[sortField] - car2[sortField]) * +sortDir);
  }

  cars = cars.map(({ _id, vendor, speed, owner }) => ({
    _id,
    vendor,
    speed,
    owner,
  }));
  return cars;
}

function getById(carId) {
  return storageService.get(STORAGE_KEY, carId);
}

async function remove(carId) {
  // throw new Error('Nope')
  await storageService.remove(STORAGE_KEY, carId);
}

async function save(car) {
  var savedCar;
  if (car._id) {
    const carToSave = {
      _id: car._id,
      speed: car.speed,
    };
    savedCar = await storageService.put(STORAGE_KEY, carToSave);
  } else {
    const carToSave = {
      vendor: car.vendor,
      speed: car.speed,
      // Later, owner is set by the backend
      owner: userService.getLoggedinUser(),
      msgs: [],
    };
    savedCar = await storageService.post(STORAGE_KEY, carToSave);
  }
  return savedCar;
}

async function addCarMsg(carId, txt) {
  // Later, this is all done by the backend
  const car = await getById(carId);

  const msg = {
    id: makeId(),
    by: userService.getLoggedinUser(),
    txt,
  };
  car.msgs.push(msg);
  await storageService.put(STORAGE_KEY, car);

  return msg;
}
