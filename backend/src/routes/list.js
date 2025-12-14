import express from "express";
import {
  createList,
  getListById,
  getListsByBoardId,
  updateList,
  moveList,
  archiveList,
  deleteList,
  copyList,
} from "../controllers/list-controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { canModifyList, canCreateList } from "../middleware/authorize.js";

const router = express.Router();

router.get("/", getListsByBoardId);
router.get("/:id", getListById);
router.post("/", authenticate, canCreateList(), createList);
router.put("/:id", authenticate, canModifyList(), updateList);
router.put("/:id/move", authenticate, canModifyList(), moveList);
router.put("/:id/archive", authenticate, canModifyList(), archiveList);
router.delete("/:id", authenticate, canModifyList(), deleteList);
router.post("/:id/copy", authenticate, canModifyList(), copyList);

export default router;
