import express from "express";

import authRoutes from "./auth.js";
import boardRoutes from "./boards.js";
import listRoutes from "./list.js";

const router = express.Router();

router.use("/api/auth", authRoutes);
router.use("/api/boards", boardRoutes);
router.use("/api/lists", listRoutes);

export default router;
