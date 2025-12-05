import { List } from "../../models/List.js";
import { canModifyBoardContent, canViewBoard } from "./board.js";

export async function canModifyList(userId, listId) {
  const list = await List.findById(listId);
  if (!list) return false;

  return await canModifyBoardContent(userId, list.boardId);
}

export async function canViewList(userId, listId) {
  const list = await List.findById(listId);
  if (!list) return false;

  return await canViewBoard(userId, list.boardId);
}
