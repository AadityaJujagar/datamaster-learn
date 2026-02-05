/* eslint-disable no-undef */
const cloudinary = require("cloudinary").v2;

exports.uploadFileToCloudinary = async (file, folder, height, quality) => {
  const options = {
    folder,
    resource_type: "auto",
  };

  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }

  try {
    return await cloudinary.uploader.upload(file.tempFilePath, options);
  } catch (error) {
    console.error("Error uploading video to Cloudinary:", error);
    throw new Error("Failed to upload video to Cloudinary");
  }
};
