import expess from "express";
import homeController from "../controller/homeController";

const router = expess.Router();

const initWebRoutes = (app) => {
  router.get("/", homeController.handleHello);
  router.get("/user", homeController.handleUserPage);
  router.get("/update-user/:userId", homeController.handleGetUser);

  router.post("/create-user", homeController.handleCreateUser);
  router.post("/update-user/:userId", homeController.handleUpdateUser);
  router.post("/delete-user/:userId", homeController.handleDeleteUser);
  app.use("/", router);
};

export default initWebRoutes;
