import { cloudinary } from "../config/cloudinary.js";


export const uploadToCloudinary = (buffer, folder, publicId) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: "image",
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "face" },
        { quality: "auto", fetch_format: "auto" },
      ],
    };

    if (publicId) uploadOptions.public_id = publicId;

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    stream.end(buffer);
  });
};


export const deleteFromCloudinary = async (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};


export const extractPublicId = (cloudinaryUrl) => {
  if (!cloudinaryUrl) return null;
  const parts = cloudinaryUrl.split("/");
  const uploadIndex = parts.indexOf("upload");
  if (uploadIndex === -1) return null;
  const afterUpload = parts.slice(uploadIndex + 1);
  if (afterUpload[0]?.startsWith("v")) afterUpload.shift();
  const withExtension = afterUpload.join("/");
  return withExtension.replace(/\.[^/.]+$/, "");
};
