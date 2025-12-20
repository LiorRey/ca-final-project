import { httpService } from "./http-service";
import { Cloudinary } from "@cloudinary/url-gen";
import {
  thumbnail,
  fill,
  scale,
  fit,
  limitFit,
} from "@cloudinary/url-gen/actions/resize";
import { quality, format } from "@cloudinary/url-gen/actions/delivery";

// Get cloud name from Vite environment variable
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export const attachmentService = {
  uploadImage,
  getUploadSignature,
  getImageUrl,
  getThumbnailUrl,
};

async function getUploadSignature(folder = "attachments") {
  const res = await httpService.post("upload/sign", { folder });
  return res?.signData;
}

async function uploadImage(file, destFolder = "attachments") {
  if (!file) throw new Error("No file provided");

  const { signature, timestamp, cloudName, apiKey, folder } =
    await getUploadSignature(destFolder);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const res = await fetch(uploadUrl, { method: "POST", body: formData });
  const data = await res.json();

  if (!res.ok) {
    const msg =
      data?.error?.message || data?.message || "Cloudinary upload failed";
    throw new Error(msg);
  }

  return data;
}

/**
 * Generates a full image URL from a Cloudinary public ID
 * @param {string} publicId - The Cloudinary public ID (can include folder path)
 * @param {string} cloudName - Optional cloud name. If not provided, uses VITE_CLOUDINARY_CLOUD_NAME env variable
 * @returns {string} The full image URL
 */
function getImageUrl(publicId, cloudName = null) {
  if (!publicId) throw new Error("publicId is required");

  const cloud = cloudName || CLOUD_NAME;
  if (!cloud)
    throw new Error(
      "Cloud name is required. Set VITE_CLOUDINARY_CLOUD_NAME in your .env file"
    );

  const cld = new Cloudinary({
    cloud: { cloudName: cloud },
  });

  const image = cld.image(publicId);
  return image.toURL();
}

/**
 * Generates a thumbnail URL from a Cloudinary public ID
 * @param {string} publicId - The Cloudinary public ID (can include folder path)
 * @param {Object} options - Thumbnail options
 * @param {number} options.width - Thumbnail width (default: 200)
 * @param {number} options.height - Thumbnail height (default: 200)
 * @param {string} options.crop - Crop mode: 'thumbnail', 'fill', 'scale', etc. (default: 'thumbnail')
 * @param {number} options.quality - Image quality 1-100 (default: 'auto')
 * @param {string} options.format - Image format: 'auto', 'jpg', 'png', etc. (default: 'auto')
 * @param {string} cloudName - Optional cloud name. If not provided, uses VITE_CLOUDINARY_CLOUD_NAME env variable
 * @returns {string} The thumbnail URL
 */
function getThumbnailUrl(publicId, options = {}, cloudName = null) {
  if (!publicId) throw new Error("publicId is required");

  const {
    width = 200,
    height = 200,
    crop = "thumbnail",
    quality: qualityValue = "auto",
    format: formatValue = "auto",
  } = options;

  const cloud = cloudName || CLOUD_NAME;
  if (!cloud)
    throw new Error(
      "Cloud name is required. Set VITE_CLOUDINARY_CLOUD_NAME in your .env file"
    );

  const cld = new Cloudinary({
    cloud: { cloudName: cloud },
  });

  const image = cld.image(publicId);

  if (crop === "fill") {
    image.resize(fill().width(width).height(height));
  } else if (crop === "thumbnail") {
    image.resize(thumbnail().width(width));
  } else if (crop === "scale") {
    image.resize(scale().width(width));
  } else if (crop === "fit") {
    image.resize(fit().width(width));
  } else if (crop === "limitFit") {
    image.resize(limitFit().width(width).height(height));
  } else {
    image.resize(thumbnail().width(width));
  }

  image.delivery(quality(qualityValue));
  image.delivery(format(formatValue));

  return image.toURL();
}
