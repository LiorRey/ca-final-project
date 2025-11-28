import express from "express";
import {
  createBoard,
  getAllBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
} from "../controllers/board-controller.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

// Public routes
router.get("/", getAllBoards);
router.get("/:id", getBoardById);

// Protected routes
const protectedRouter = express.Router();
protectedRouter.use(authenticate);
router.post("/", createBoard);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);

router.use("/", protectedRouter);

export default router;
