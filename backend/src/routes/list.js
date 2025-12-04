import express from "express";
import {
  createList,
  getListById,
  getListsByBoardId,
  updateList,
  moveList,
  archiveList,
  deleteList,
} from "../controllers/list-controller.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

const protectedRouter = express.Router();
protectedRouter.use(authenticate);

router.get("/", getListsByBoardId);
protectedRouter.get("/:id", getListById);
protectedRouter.post("/", createList);
protectedRouter.put("/:id", updateList);
protectedRouter.put("/:id/move", moveList);
protectedRouter.put("/:id/archive", archiveList);
protectedRouter.delete("/:id", deleteList);

router.use(protectedRouter);
export default router;
