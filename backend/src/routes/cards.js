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
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.get("/", getAllCards);
router.get("/:id", getCardById);

const protectedRouter = express.Router();
protectedRouter.use(authenticate);

router.post("/", createCard);
router.put("/:id", updateCard);
router.delete("/:id", deleteCard);

router.use("/", protectedRouter);
// router.get("/label/:labelId", getCardsByLabel);
// router.get("/assigned/:userId", getCardsByAssignedUser);

export default router;
