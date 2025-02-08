import expess from "express";
import apiController from "../controller/apiController";
import userController from "../controller/userController";
import groupController from "../controller/groupController";
import { checkUserJWT, checkUserPermission } from "../middleware/JWTActions";

//------zenco--------
//banner routes
import bannerRoutes from "./zencomex/bannerRoutes";
//product routes
import productRoutes from "./zencomex/productRoutes";
//------upload--------
import uploadRoutes from "./zencomex/uploads/upload-to-cloundinary";
import uploadToFolder from "./zencomex/uploads/upload-to-folder";
//------general--------//
import generalRoutes from "./zencomex/generalRoutes";

//---------images--------
import imageRoutes from "./zencomex/images/readImageRoutes";

// ---------- Admin user ------------
import adminRoutes from "./zencomex/admin/adminRoutes";

// ----------- Footer ------------
import footerRoutes from "./zencomex/footerRoutes";

// Mail
import emailRoutes from "./zencomex/emailRoutes";

const router = expess.Router();

const initApiRoutes = (app) => {
    // router.all("*", checkUserJWT, checkUserPermission);

    router.post("/register", apiController.handleRegister);
    router.post("/login", apiController.handleLogin);
    router.post("/logout", apiController.handleLogout);
    router.get("/account", userController.getUserAccount);

    router.get("/user/show", userController.showUser);
    router.post("/user/create", userController.createUser);
    router.put("/user/update", userController.updateUser);
    router.delete("/user/delete", userController.deleteUser);

    router.get("/group/show", groupController.showGroup);

    //-----zenco--------
    //banner
    router.use("/home", bannerRoutes);

    //upload to folder
    router.use("/upload-to-folder", uploadToFolder);

    //upload banner
    router.use("/upload", uploadRoutes);

    // products
    router.use("/product", productRoutes);

    //images
    router.use("/image", imageRoutes);

    //general
    router.use("/general", generalRoutes);

    //footer
    router.use("/footer", footerRoutes);

    // Admin user
    router.use("/admin", adminRoutes);

    //Email
    router.use("/email", emailRoutes);

    return app.use("/api", router);
};

export default initApiRoutes;
