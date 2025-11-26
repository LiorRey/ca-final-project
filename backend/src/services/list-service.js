import { List } from "../models/List.js";

export async function createList(listData) {
  const list = new List({
    ...listData,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    archivedAt: null,
    deletedAt: null,
  });
  await list.save();
  return list;
}

export async function getListById(id) {
  const list = await List.findById(id);
  return list;
}

export async function getListsByBoardId(boardId) {
  const lists = await List.find({ boardId });
  return lists;
}

export async function updateList(id, updateData) {
  const list = await List.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  return list;
}

export async function repositionList(id, position) {
  const list = await List.findById(id);
  if (!list) {
    return null;
  }
  list.position = position;
  await list.save();
  return list;
}

export async function archiveList(id) {
  const list = await List.findById(id);
  if (!list) {
    return { error: "not_found" };
  }
  if (list.archivedAt) {
    return { error: "already_archived" };
  }
  list.archivedAt = Date.now();
  await list.save();
  return { data: list };
}

export async function deleteList(id) {
  const list = await List.findByIdAndDelete(id);
  return list;
}
