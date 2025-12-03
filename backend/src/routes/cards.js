import express from "express";
import {
  createCard,
  getAllCards,
  getCardById,
  updateCard,
  deleteCard,
  getCardsByLabel,
  getCardsByAssignedUser,
  updateLabels,
} from "../controllers/card-controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { canModifyCard, canCreateCard } from "../middleware/authorize.js";

const router = express.Router();

router.get("/", getAllCards);
router.get("/:id", getCardById);
router.post("/", authenticate, canCreateCard(), createCard);
router.put("/:id", authenticate, canModifyCard(), updateCard);
router.delete("/:id", authenticate, canModifyCard(), deleteCard);
router.put("/:id/labels", authenticate, canModifyCard(), updateLabels);

// router.get("/label/:labelId", getCardsByLabel);
// router.get("/assigned/:userId", getCardsByAssignedUser);

export default router;
