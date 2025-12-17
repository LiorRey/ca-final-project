import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { getUploadSignature } from "../controllers/cloudinary-controller.js";

const router = express.Router();

router.post("/sign", authenticate, getUploadSignature);

export default router;
