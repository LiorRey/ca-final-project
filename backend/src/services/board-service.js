// backend/src/services/board-service.js

import { Board } from "../models/Board.js";
import { List } from "../models/List.js";
import { Card } from "../models/Card.js";
import { groupBy } from "./utils-service.js";

export async function createBoard(data) {
  return await Board.create(data);
}

export async function getAllBoards() {
  return await Board.find();
}

export async function getBoardById(id) {
  return await Board.findById(id);
}

export async function getFullBoardById(id) {
  const board = await Board.findById(id).lean();
  if (!board) return null;

  const [lists, cards] = await Promise.all([
    List.find({ boardId: id }).sort({ position: 1 }).lean(),
    Card.find({ boardId: id }).sort({ position: 1 }).lean(),
  ]);

  const cardsByListId = groupBy(cards, card => card.listId.toString());

  const listsWithCards = lists.map(list => {
    return {
      ...list,
      cards: cardsByListId.get(list._id.toString()) || [],
    };
  });

  return {
    ...board,
    lists: listsWithCards,
  };
}

export async function updateBoard(id, data) {
  return await Board.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

export async function deleteBoard(id) {
  return await Board.findByIdAndDelete(id);
}
