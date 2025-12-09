import { List } from "../models/List.js";
import { calculateNewPosition } from "../services/position-service.js";
import { getBoardById } from "./board-service.js";
import createHttpError from "http-errors";

export async function createList(listData) {
  const { boardId, title, targetIndex } = listData;
  let position;
  if (!targetIndex) {
    const lists = await List.find({ boardId }).sort({ position: 1 });
    position = calculateNewPosition(lists, lists.length);
  } else {
    // TODO: implement inserting at specific index
  }
  const list = await List.create({
    boardId,
    title,
    position,
  });
  return list;
}

export async function getListById(id) {
  return List.findById(id);
}

export async function getListsByBoardId(boardId) {
  return List.find({ boardId });
}

export async function updateList(id, updateData) {
  return List.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
}

export async function moveList(listId, boardId, targetIndex) {
  const board = await getBoardById(boardId);
  if (!board) {
    throw createHttpError(404, "Board not found");
  }

  let lists = await List.find({ boardId }).sort({ position: 1 });
  let newPosition = calculateNewPosition(lists, targetIndex);

  return await List.findByIdAndUpdate(
    listId,
    { position: newPosition, boardId },
    { new: true }
  );
}

export async function archiveList(id) {
  const list = await List.findById(id);
  if (!list) throw createHttpError(404, "List not found");
  if (list.archivedAt) return null;
  list.archivedAt = new Date();
  return list.save();
}

export async function deleteList(id) {
  return List.findByIdAndDelete(id);
}
