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
import { loadBoard } from "../middleware/load-board.js";

const router = express.Router();

// Public routes
router.get("/", getAllBoards);
router.get("/:id", getBoardById);
router.get("/:id/full", getFullBoardById);

// Protected routes
const protectedRouter = express.Router();
protectedRouter.use(authenticate);
protectedRouter.post("/", createBoard);

// Routes with authorization and other middleware
protectedRouter.put("/:id", loadBoard, updateBoard);
protectedRouter.delete("/:id", loadBoard, deleteBoard);

protectedRouter.get("/:id/labels", loadBoard, getBoardLabels);
protectedRouter.post("/:id/labels", loadBoard, addBoardLabel);
protectedRouter.put("/:id/labels/:labelId", loadBoard, updateBoardLabel);
protectedRouter.delete("/:id/labels/:labelId", loadBoard, deleteBoardLabel);

router.use("/", protectedRouter);

export default router;
