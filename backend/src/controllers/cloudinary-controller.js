import createError from "http-errors";
import * as cloudinaryService from "../services/cloudinary-service.js";

const ALLOWED_FOLDERS = new Set(["card-covers"]);

export async function getUploadSignature(req, res) {
  const folder = req.body?.folder;
  if (!folder) throw createError(400, "folder is required");
  if (!ALLOWED_FOLDERS.has(folder)) throw createError(400, "Invalid folder");

  const signData = cloudinaryService.generateUploadSignature(folder);
  if (!signData)
    throw createError(500, "Failed to generate Cloudinary signature");

  res.json({ signData });
}
