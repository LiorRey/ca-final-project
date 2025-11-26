import express from "express";

import authRoutes from "./auth.js";
import listRoutes from "./list.js";

const router = express.Router();

router.use("/api/auth", authRoutes);
router.use("/api/list", listRoutes);

export default router;
