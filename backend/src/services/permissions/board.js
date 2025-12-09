import { Board } from "../../models/Board.js";
import { isMemberOfArray, isOwner } from "./helpers.js";

export async function canViewBoard(userId, boardId) {
  const board = await Board.findById(boardId);
  if (!board) return false;

  return (
    isOwner(userId, board.owner.userId) ||
    isMemberOfArray(userId, board.members)
  );
}

export async function canManageBoard(userId, boardId) {
  const board = await Board.findById(boardId);
  if (!board) return false;

  return (
    isOwner(userId, board.owner.userId) ||
    isMemberOfArray(userId, board.members)
  );
}

export async function canModifyBoardContent(userId, boardId) {
  const board = await Board.findById(boardId);
  if (!board) return false;

  return (
    isOwner(userId, board.owner.userId) ||
    isMemberOfArray(userId, board.members)
  );
}

export async function isBoardOwner(userId, boardId) {
  const board = await Board.findById(boardId);
  if (!board) return false;

  return isOwner(userId, board.owner.userId);
}
