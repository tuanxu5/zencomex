import { Router } from "express";
import productController from "../../controller/zenco-controllers/productController";

const router = Router();

//---------Category---------//
router.get("/category", productController.listCategories);
router.post("/category/create", productController.createCategory);
router.delete("/category/delete/:id", productController.deleteCategory);
router.post("/category/update/:id", productController.updateCategory);
router.get("/category/:id", productController.getCategoryDetail);

//---------Child Category---------//
router.get("/child-category", productController.listChildCategories);
router.post("/child-category/create", productController.createChildCategory);
router.delete("/child-category/delete/:id", productController.deleteChildCategory);
router.post("/child-category/update/:id", productController.updateChildCategory);
router.get("/child-category/:id", productController.getChildCategoryDetail);

//---------Product---------//
router.get("/list", productController.listProducts);

//favorite product
router.get("/favorite", productController.getProductFavorite);

router.post("/create", productController.createProduct);
router.delete("/delete/:id", productController.deleteProduct);
router.post("/update/:id", productController.updateProduct);
router.get("/:id", productController.getProductDetail);

//-------checkURL-------//
router.post("/check", productController.checkURL);

export default router;
