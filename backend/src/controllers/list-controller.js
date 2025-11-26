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

export async function getListByBoardId(req, res, next) {
  try {
    const list = await listService.getListsByBoardId(req.params.boardId);
    if (!list) {
      throw createHttpError(404, "Lists not found");
    }
    res.json({ success: true, data: list });
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

export async function repositionList(req, res, next) {
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
    const result = await listService.archiveList(req.params.id);
    if (result.error === "not_found") {
      throw createHttpError(404, "List not found and was not archived");
    }
    if (result.error === "already_archived") {
      throw createHttpError(400, "List is already archived");
    }
    res.json({ success: true, data: result.data });
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
