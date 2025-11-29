import { Board } from "../models/Board.js";

export async function createBoard(req, res) {
  try {
    const { title, description, owner } = req.body;
    const board = await Board.create({
      title,
      description,
      owner,
    });
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
    const boards = await Board.find();
    res.json({ boards });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch boards" });
  }
}

export async function getBoardById(req, res) {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ error: "Board not found" });

    res.json({ board });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch board" });
  }
}

export async function updateBoard(req, res) {
  try {
    const { title, description, owner } = req.body;
    const board = await Board.findByIdAndUpdate(
      req.params.id,
      { title, description, owner },
      { new: true, runValidators: true }
    );
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
  try {
    const board = await Board.findByIdAndDelete(req.params.id);
    if (!board) return res.status(404).json({ error: "Board not found" });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete board" });
  }
}
