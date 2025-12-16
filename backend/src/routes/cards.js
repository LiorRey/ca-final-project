import express from "express";
import {
  createCard,
  getAllCards,
  getCardById,
  updateCard,
  deleteCard,
  moveCard,
  getCardsByLabel,
  getCardsByAssignedUser,
  updateLabels,
  addComment,
  updateComment,
  deleteComment,
  getComments,
  addAssignee,
  removeAssignee,
  copyCard,
  upsertCardCover,
} from "../controllers/card-controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { canModifyCard, canCreateCard } from "../middleware/authorize.js";

const router = express.Router();

router.get("/", getAllCards);
router.get("/:id", getCardById);
router.post("/", authenticate, canCreateCard(), createCard);
router.put("/:id", authenticate, canModifyCard(), updateCard);
router.delete("/:id", authenticate, canModifyCard(), deleteCard);
router.put("/:id/move", authenticate, canModifyCard(), moveCard);
router.put("/:id/labels", authenticate, canModifyCard(), updateLabels);
router.put("/:id/cover", authenticate, canModifyCard(), upsertCardCover);
router.post("/:cardId/comments", authenticate, canModifyCard(), addComment);
router.put(
  "/:cardId/comments/:commentId",
  authenticate,
  canModifyCard(),
  updateComment
);
router.delete(
  "/:cardId/comments/:commentId",
  authenticate,
  canModifyCard(),
  deleteComment
);
router.get("/:cardId/comments", authenticate, getComments);

// router.get("/label/:labelId", getCardsByLabel);
// router.get("/assigned/:userId", getCardsByAssignedUser);

router.post("/:id/assignees", authenticate, canModifyCard(), addAssignee);
router.delete(
  "/:id/assignees/:userId",
  authenticate,
  canModifyCard(),
  removeAssignee
);

router.post("/:id/copy", authenticate, canModifyCard(), copyCard);

export default router;
