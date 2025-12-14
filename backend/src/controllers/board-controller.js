import * as boardService from "../services/board-service.js";
import createError from "http-errors";

export async function createBoard(req, res) {
  try {
    const { title, description } = req.body;
    const owner = {
      userId: req.currentUser._id,
      username: req.currentUser.username,
      fullname: req.currentUser.fullname,
    };
    const board = await boardService.createBoard({ title, description, owner });
    res.status(201).json({ board });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Failed to create board" });
  }
}

export async function getAllBoards(_req, res) {
  try {
    const boards = await boardService.getAllBoards();
    res.json({ boards });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch boards" });
  }
}

export async function getBoardById(req, res) {
  try {
    const board = await boardService.getBoardById(req.params.id);
    if (!board) return res.status(404).json({ error: "Board not found" });

    res.json({ board });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch board" });
  }
}

export async function getFullBoardById(req, res) {
  const fullBoard = await boardService.getFullBoardById(req.params.id);
  if (!fullBoard) throw createError(404, "Board not found");

  res.json({ board: fullBoard });
}

export async function updateBoard(req, res) {
  try {
    const { title, description, owner } = req.body;
    const board = await boardService.updateBoard(req.params.id, {
      title,
      description,
      owner,
    });
    if (!board) return res.status(404).json({ error: "Board not found" });

    res.json({ board });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Failed to update board" });
  }
}

export async function deleteBoard(req, res) {
  const board = await boardService.deleteBoard(req.params.id);
  if (!board) throw createError(404, "Board not found");

  res.status(204).send();
}

export async function getBoardLabels(req, res) {
  const board = await boardService.getBoardLabels(req.params.id);
  res.json({ labels: board.labels });
}

export async function addBoardLabel(req, res) {
  const { title, color } = req.body;
  const label = await boardService.addLabelToBoard(req.params.id, {
    title,
    color,
  });
  res.status(201).json({ label });
}

export async function updateBoardLabel(req, res) {
  const { title, color } = req.body;
  const updatedLabel = await boardService.updateLabelInBoard(
    req.params.id,
    req.params.labelId,
    { title, color }
  );
  if (!updatedLabel) throw createError(404, "Label not found");
  res.json({ label: updatedLabel });
}

export async function deleteBoardLabel(req, res) {
  const board = await boardService.removeLabelFromBoard(
    req.params.id,
    req.params.labelId
  );
  if (!board) throw createError(404, "Label not found");
  res.status(204).send();
}
