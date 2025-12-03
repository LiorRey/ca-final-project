import * as listService from "../services/list-service.js";
import createError from "http-errors";

export async function createList(req, res) {
  const list = await listService.createList(req.body);
  res.status(201).json({ list });
}

export async function getListById(req, res) {
  const list = await listService.getListById(req.params.id);
  if (!list) throw createError(404, "List not found");

  res.status(200).json({ list });
}

export async function getListsByBoardId(req, res) {
  const { boardId } = req.query;
  if (!boardId) throw createError(400, "boardId is required");

  const lists = await listService.getListsByBoardId(boardId);
  res.status(200).json({ lists });
}

export async function updateList(req, res) {
  const list = await listService.updateList(req.params.id, req.body);
  if (!list) throw createError(404, "List not found");

  res.status(200).json({ list });
}

export async function moveList(req, res) {
  const list = await listService.moveList(req.params.id, req.body.position);
  if (!list) throw createError(404, "List not found");

  res.status(200).json({ list });
}

export async function archiveList(req, res) {
  const list = await listService.archiveList(req.params.id);
  if (!list) throw createError(404, "List not found");

  res.status(200).json({ list });
}

export async function deleteList(req, res) {
  const deletedList = await listService.deleteList(req.params.id);
  if (!deletedList) throw createError(404, "List not found");

  res.status(200).json({ id: deletedList._id });
}
