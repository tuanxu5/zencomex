const { Router } = require("express");
import generalController from "../../controller/zenco-controllers/generalController";

const router = Router();

router.get("/page-seo", generalController.getPageSeo);

router.get("/:type", generalController.getInfoGeneral);

router.get("/tag/:type", generalController.getAllTag);

router.post("/update/:id", generalController.updateGeneral);

router.delete("/delete/:id", generalController.deleteGeneral);

router.post("/create", generalController.createGeneral);

router.put("/introduct/:id", generalController.updateIntroductCompany);

router.post("/check", generalController.checkURL);

export default router;
