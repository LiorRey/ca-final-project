import { Board } from "../models/Board.js";

export async function loadBoard(req, res, next) {
  const boardId = req.params.id;
  if (!boardId) {
    return res.status(400).send("Board ID is required");
  }

  const board = await Board.findById(boardId);
  if (!board) {
    return res.status(404).send("Board not found");
  }

  req.board = board;
  next();
}
