import express from "express";

import authRoutes from "./auth.js";
import boardRoutes from "./boards.js";
import listRoutes from "./list.js";
import cardRoutes from "./cards.js";
import uploadRoutes from "./upload.js";

const router = express.Router();

router.use("/api/auth", authRoutes);
router.use("/api/boards", boardRoutes);
router.use("/api/lists", listRoutes);
router.use("/api/cards", cardRoutes);
router.use("/api/upload", uploadRoutes);

export default router;
