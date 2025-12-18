import { httpService } from "./http-service";

export const attachmentService = {
  uploadImage,
  getUploadSignature,
};

async function getUploadSignature(folder = "card-covers") {
  const res = await httpService.post("upload/sign", { folder });
  return res?.signData;
}

async function uploadImage(file, destFolder = "card-covers") {
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
