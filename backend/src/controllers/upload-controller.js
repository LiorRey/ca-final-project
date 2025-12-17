import createError from "http-errors";
import * as uploadService from "../services/upload-service.js";

const ALLOWED_FOLDERS = new Set(["card-covers"]);

export async function getUploadSignature(req, res) {
  const folder = req.body?.folder;
  if (!folder) throw createError(400, "folder is required");
  if (!ALLOWED_FOLDERS.has(folder)) throw createError(400, "Invalid folder");

  const signData = uploadService.generateUploadSignature(folder);
  if (!signData) throw createError(500, "Failed to generate upload signature");

  res.status(200).json({ signData });
}
