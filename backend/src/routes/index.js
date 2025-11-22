import express from "express";

import authRoutes from "./auth.js";

const router = express.Router();

router.use("/api/auth", authRoutes);

export default router;
