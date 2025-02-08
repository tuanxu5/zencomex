import { Router } from "express";
import uploadToFolder from "../../../middleware/upload/uploadToFolder";

const router = Router();

//upload to folder
router.post("/upload", uploadToFolder.array("files", 10), (req, res) => {
    return res.status(200).json({
        EM: "upload successfully",
        EC: "0",
        EF: "",
        DT: req.files,
    });
});

export default router;
