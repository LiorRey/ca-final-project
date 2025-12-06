import express from "express";
import {
  createBoard,
  getAllBoards,
  getBoardById,
  getFullBoardById,
  updateBoard,
  deleteBoard,
  getBoardLabels,
  addBoardLabel,
  updateBoardLabel,
  deleteBoardLabel,
} from "../controllers/board-controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { canManageBoard, canCreateBoard } from "../middleware/authorize.js";

const router = express.Router();

router.get("/", getAllBoards);
router.get("/:id", getBoardById);
router.get("/:id/full", getFullBoardById);
router.post("/", authenticate, canCreateBoard(), createBoard);
router.put("/:id", authenticate, canManageBoard(), updateBoard);
router.delete("/:id", authenticate, canManageBoard(), deleteBoard);
router.get("/:id/labels", authenticate, canManageBoard(), getBoardLabels);
router.post("/:id/labels", authenticate, canManageBoard(), addBoardLabel);
router.put(
  "/:id/labels/:labelId",
  authenticate,
  canManageBoard(),
  updateBoardLabel
);
router.delete(
  "/:id/labels/:labelId",
  authenticate,
  canManageBoard(),
  deleteBoardLabel
);
export default router;
