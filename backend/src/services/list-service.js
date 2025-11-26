import { List } from "../models/List.js";
import createHttpError from "http-errors";

export async function createList(listData) {
  return new List(listData).save();
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

export async function moveList(id, position) {
  return List.findByIdAndUpdate(id, { position }, { new: true });
}

export async function archiveList(id) {
  const list = await List.findById(id);
  if (!list) throw createHttpError(404, "List not found");
  if (list.archivedAt) throw createHttpError(400, "List is already archived");
  list.archivedAt = new Date();
  return list.save();
}

export async function deleteList(id) {
  return List.findByIdAndDelete(id);
}
