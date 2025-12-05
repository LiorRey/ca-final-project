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

const router = express.Router();

router.get("/", getAllCards);
router.get("/:id", getCardById);

const protectedRouter = express.Router();
protectedRouter.use(authenticate);

protectedRouter.post("/", createCard);
protectedRouter.put("/:id", updateCard);
protectedRouter.put("/:id/labels", updateLabels);
protectedRouter.delete("/:id", deleteCard);

router.use("/", protectedRouter);

// router.get("/label/:labelId", getCardsByLabel);
// router.get("/assigned/:userId", getCardsByAssignedUser);

export default router;
