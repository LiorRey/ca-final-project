import createError from "http-errors";
import * as permissions from "../services/permissions/index.js";

export function authorize(permissionCheck) {
  return async (req, _res, next) => {
    try {
      const userId = req.currentUser._id;
      const hasPermission = await permissionCheck(req, userId);

      if (!hasPermission) {
        return next(
          createError(403, "You do not have permission to perform this action")
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function canViewBoard() {
  return authorize(async (req, userId) => {
    return await permissions.board.canViewBoard(userId, req.params.id);
  });
}

export function canManageBoard() {
  return authorize(async (req, userId) => {
    return await permissions.board.canManageBoard(userId, req.params.id);
  });
}

export function canModifyBoardContent() {
  return authorize(async (req, userId) => {
    return await permissions.board.canModifyBoardContent(userId, req.params.id);
  });
}

export function canModifyList() {
  return authorize(async (req, userId) => {
    return await permissions.list.canModifyList(userId, req.params.id);
  });
}

export function canModifyCard() {
  return authorize(async (req, userId) => {
    return await permissions.card.canModifyCard(userId, req.params.id);
  });
}

export function canCreateBoard() {
  return authorize(async (req, userId) => {
    return true;
  });
}

export function canCreateList() {
  return authorize(async (req, userId) => {
    const boardId =
      req.body.boardId ||
      req.query.boardId ||
      (req.body.list && req.body.list.board);
    if (!boardId) return false;
    return await permissions.board.canModifyBoardContent(userId, boardId);
  });
}

export function canCreateCard() {
  return authorize(async (req, userId) => {
    const boardId =
      req.body.boardId ||
      req.query.boardId ||
      (req.body.card && req.body.card.board) ||
      (req.body.list && req.body.list.board);
    if (!boardId) return false;
    return await permissions.board.canModifyBoardContent(userId, boardId);
  });
}
