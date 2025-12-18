import express from "express";

import authRoutes from "./auth.js";
import boardRoutes from "./boards.js";
import listRoutes from "./list.js";
import cardRoutes from "./cards.js";
import uploadRoutes from "./upload.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/boards", boardRoutes);
router.use("/lists", listRoutes);
router.use("/cards", cardRoutes);
router.use("/upload", uploadRoutes);
export default router;
