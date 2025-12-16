import { List } from "../models/List.js";
import { Card } from "../models/Card.js";
import { calculateNewPosition } from "../services/position-service.js";
import { getBoardById } from "./board-service.js";
import { copyCard } from "./card-service.js";
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

  let lists = await List.find({ boardId, _id: { $ne: listId } }).sort({
    position: 1,
  });
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

export async function copyList(listId, copyOptions = {}) {
  const {
    copyCards = false,
    targetBoardId = null,
    targetIndex = null,
    title = null,
  } = copyOptions;

  const sourceList = await List.findById(listId);
  if (!sourceList) throw createHttpError(404, "Source list not found");

  const finalBoardId = targetBoardId ?? sourceList.boardId;

  if (targetBoardId && targetBoardId !== sourceList.boardId.toString()) {
    const targetBoard = await getBoardById(targetBoardId);
    if (!targetBoard) throw createHttpError(404, "Target board not found");
  }

  const targetLists = await List.find({ boardId: finalBoardId }).sort({
    position: 1,
  });

  const finalIndex = targetIndex ?? targetLists.length;
  const newPosition = calculateNewPosition(targetLists, finalIndex);

  const copiedListData = {
    boardId: finalBoardId,
    title: title ?? `${sourceList.title} (copy)`,
    description: sourceList.description,
    position: newPosition,
  };

  const copiedList = await List.create(copiedListData);

  if (copyCards) {
    const sourceCards = await Card.find({ listId: sourceList._id }).sort({
      position: 1,
    });

    for (let i = 0; i < sourceCards.length; i++) {
      const sourceCard = sourceCards[i];
      await copyCard(sourceCard._id.toString(), {
        copyLabels: true,
        copyAssignees: true,
        copyComments: true,
        copyDates: true,
        targetListId: copiedList._id.toString(),
        targetBoardId: finalBoardId,
        targetIndex: i,
      });
    }
  }

  return await List.findById(copiedList._id).populate({
    path: "cards",
    options: { sort: { position: 1 } },
  });
}
