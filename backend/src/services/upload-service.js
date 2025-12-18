import createError from "http-errors";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../config/env.js";

function ensureConfigured() {
  const { cloudName, apiKey, apiSecret } = config.cloudinary || {};
  if (!cloudName || !apiKey || !apiSecret) {
    throw createError(503, "Upload provider is not configured");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export function generateUploadSignature(folder) {
  ensureConfigured();

  const timestamp = Math.floor(Date.now() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    cloudinary.config().api_secret
  );

  return {
    signature,
    timestamp,
    cloudName: cloudinary.config().cloud_name,
    apiKey: cloudinary.config().api_key,
    folder,
  };
}
