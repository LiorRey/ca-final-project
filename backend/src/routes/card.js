import express from "express";
import {
  createCard,
  getAllCards,
  getCardById,
  updateCard,
  deleteCard,
  getCardsByLabel,
  getCardsByAssignedUser,
} from "../controllers/card-controller.js";

const router = express.Router();

router.post("/", createCard);
router.get("/", getAllCards);
router.get("/:id", getCardById);
router.put("/:id", updateCard);
router.delete("/:id", deleteCard);

router.get("/label/:labelId", getCardsByLabel);
router.get("/assigned/:userId", getCardsByAssignedUser);

export default router;
