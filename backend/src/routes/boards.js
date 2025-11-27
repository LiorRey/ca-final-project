import express from "express";
import {
  createBoard,
  getAllBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
} from "../controllers/board-controller.js";

const router = express.Router();

router.post("/", createBoard);
router.get("/", getAllBoards);
router.get("/:id", getBoardById);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);

export default router;
