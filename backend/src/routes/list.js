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

const router = express.Router();

router.get("/", getListsByBoardId);
router.post("/", createList);
router.get("/:id", getListById);
router.put("/:id", updateList);
router.put("/:id/move", moveList);
router.put("/:id/archive", archiveList);
router.delete("/:id", deleteList);

export default router;
