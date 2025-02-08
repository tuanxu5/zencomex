import { Router } from "express";
import uploadFiles from "../../../middleware/upload/uploadToCloudinary";
import uploadToFolder from "../../../middleware/upload/uploadToFolder";
import homeController from "../../../controller/zenco-controllers/homeController";
import productController from "../../../controller/zenco-controllers/productController";
import express from "express";
import path from "path";
import deleteImage from "../../../middleware/upload/deleteFileFolder";
const router = Router();

// Đường dẫn đến thư mục 'upload/product'
const uploadDirectory = path.join(__dirname, "../../../../public/upload/");
// Cấu hình router để phục vụ các tệp tin từ thư mục 'upload/product'
router.use("/", express.static(uploadDirectory));

//upload to folder
router.post("/folder", uploadToFolder.array("files", 50), homeController.uploadImageToFolder);

router.post("/folder/delete", deleteImage, homeController.deleteImageFolder);

// banner
router.post("/banner", uploadFiles.array("files", 10), homeController.uploadImageBanner);

// product
//---Image of product editor-------
router.post("/editor", uploadFiles.array("files", 10), productController.saveInfoImage);

export default router;
