import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";

cloudinary.config({
  cloud_name: process.env.APP_CLOUDINARY_NAME,
  api_key: process.env.APP_CLOUDINARY_API_KEY,
  api_secret: process.env.APP_CLOUDINARY_SECRET,
});

const storageUpload = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const folder = req.query.folder || "images";
    const extension = path.extname(file.originalname).substring(1);
    const filename = file.originalname.split(".")[0];
    return {
      folder: folder, // Optional: folder to store images in Cloudinary
      format: extension, // giữ định dạng gốc của file
      public_id: filename, // tên file tuỳ chỉnh
    };
  },
});

const uploadFiles = multer({ storage: storageUpload });

module.exports = uploadFiles;
