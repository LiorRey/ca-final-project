import express from "express";
import {
  createList,
  getListById,
  getListByBoardId,
  updateList,
  repositionList,
  archiveList,
  deleteList,
} from "../controllers/list-controller.js";

const router = express.Router();

router.get("/by-board/:boardId", getListByBoardId);
router.post("/", createList);
router.get("/:id", getListById);
router.put("/:id", updateList);
router.put("/:id/reposition", repositionList);
router.put("/:id/archive", archiveList);
router.delete("/:id", deleteList);

export default router;
