import { Router } from "express";
import cloudinary from "cloudinary";
import imageController from "../../../controller/zenco-controllers/imageController";

const router = Router();

router.get("/info", async (req, res) => {
    const { public_id } = req.body;
    if (!public_id) {
        return res.status(400).json({
            EM: "public_id is required",
            EC: "-1",
            EF: "",
            DT: "",
        });
    }
    try {
        const result = await cloudinary.v2.api.resource(public_id);
        return res.status(200).json({
            EM: "get image successfully",
            EC: "0",
            EF: "",
            DT: result,
        });
    } catch (error) {
        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            EF: "",
            DT: "",
        });
    }
});

// delete image by path have id_vitri and no id_vitri
router.delete("/delete", imageController.deleteImageByPath);

// create images
router.post("/create", imageController.createImage);

// update images
router.post("/update", imageController.updateImage);

// update images by id
router.post("/update/:id", imageController.updateImageById);

// get images by id_vitri
router.get("/list/:id_vitri", imageController.getImagesByIdVitri);

// get images by id product
router.get("/list/product/:id_product", imageController.getImagesByIdProduct);

// get images by type
router.get("/list", imageController.getImagesByType);

export default router;
