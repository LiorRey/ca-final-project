const { DEV, VITE_LOCAL } = import.meta.env;

import { boardService as local } from "./board-service-local";
import { boardDataGenerator } from "../board/board-data-generator.js";

function getEmptyBoard() {
  return {
    _id: crypto.randomUUID(),
    title: "",
    description: "",
    createdAt: null,
    updatedAt: null,
    lists: [],
    activities: [],
    listOrder: [],
  };
}

export function getEmptyLabel() {
  return {
    id: crypto.randomUUID(),
    title: "",
    color: "",
  };
}

const service = VITE_LOCAL === "true" ? local : local; // "true" ? local : remote;
export const boardService = {
  getEmptyBoard,
  getEmptyLabel,
  ...service,
};

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) {
  window.boardService = boardService;
  window.boardDataGenerator = boardDataGenerator;
}
