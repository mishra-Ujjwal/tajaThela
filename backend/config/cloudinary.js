import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (file) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const res = await cloudinary.uploader.upload(file);
    // Delete local file after upload
    fs.unlinkSync(file);
    return res.secure_url;
  } catch (err) {
    // Delete local file even if upload fails
    fs.unlinkSync(file);
    // Throw error to be caught in controller
    throw new Error(err.message);
  }
};

export default uploadOnCloudinary;
