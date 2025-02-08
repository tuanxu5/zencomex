import { Router } from "express";
import homeController from "../../controller/zenco-controllers/homeController";

const router = Router();

router.get("/slides", homeController.showBanner);
router.delete("/slides/delete/:id", homeController.deleteBanner);
router.put("/slides/update", homeController.updateBanner);

export default router;
