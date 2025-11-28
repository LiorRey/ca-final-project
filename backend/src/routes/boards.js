import express from "express";
import {
  createBoard,
  getAllBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
} from "../controllers/board-controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { loadBoard } from "../middleware/load-board.js";

const router = express.Router();

// Public routes
router.get("/", getAllBoards);
router.get("/:id", loadBoard, getBoardById);

// Protected routes
const protectedRouter = express.Router();
protectedRouter.use(authenticate);
protectedRouter.post("/", createBoard);

// Routes with authorization and other middleware
protectedRouter.put("/:id", loadBoard, updateBoard);
protectedRouter.delete("/:id", loadBoard, deleteBoard);

router.use("/", protectedRouter);

export default router;
