const { Router } = require("express");
import emailController from "../../controller/zenco-controllers/mailController";

const router = Router();

router.get("", emailController.getAllEmail);
router.post("/send", emailController.sendEmail);
router.delete("/delete/:id", emailController.deleteEmail);

export default router;
