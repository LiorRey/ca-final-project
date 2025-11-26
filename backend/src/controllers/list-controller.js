import * as listService from "../services/list-service.js";
import createHttpError from "http-errors";

export async function createList(req, res, next) {
  try {
    const list = await listService.createList(req.body);
    res.status(201).json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
}

export async function getListById(req, res, next) {
  try {
    const list = await listService.getListById(req.params.id);
    if (!list) {
      throw createHttpError(404, "List not found");
    }
    res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
}

export async function getListsByBoardId(req, res, next) {
  try {
    const { boardId } = req.query;
    if (!boardId) {
      throw createHttpError(400, "boardId query parameter is required");
    }
    const lists = await listService.getListsByBoardId(boardId);
    res.json({ success: true, data: lists });
  } catch (error) {
    next(error);
  }
}

export async function updateList(req, res, next) {
  try {
    const list = await listService.updateList(req.params.id, req.body);
    if (!list) {
      throw createHttpError(404, "List not found and was not updated");
    }
    res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
}

export async function moveList(req, res, next) {
  try {
    const list = await listService.repositionList(
      req.params.id,
      req.body.position
    );
    if (!list) {
      throw createHttpError(404, "List not found and was not repositioned");
    }
    res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
}

export async function archiveList(req, res, next) {
  try {
    const list = await listService.archiveList(req.params.id);
    res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
}

export async function deleteList(req, res, next) {
  try {
    const list = await listService.deleteList(req.params.id);
    if (!list) {
      throw createHttpError(404, "List not found");
    }
    res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
}
