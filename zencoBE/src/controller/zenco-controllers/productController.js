import productService from "../../service/zenco-services/productService";

//---------- category ------------//
const listCategories = async (req, res) => {
    try {
        let data = await productService.listCategories(req);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            total: data.total,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: "",
        });
    }
};

const createCategory = async (req, res) => {
    const { body } = req;
    try {
        let data = await productService.createCategory(body);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: "",
        });
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        let data = await productService.deleteCategory(id);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: "",
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        let data = await productService.updateCategory(req);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: "",
        });
    }
};

const getCategoryDetail = async (req, res) => {
    const { id } = req.params;
    try {
        let data = await productService.getCategoryDetail(id);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: "",
        });
    }
};

//---------- child category ------------//
const listChildCategories = async (req, res) => {
    try {
        let data = await productService.listChildCategories(req);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            total: data.total,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: "",
        });
    }
};

const createChildCategory = async (req, res) => {
    const { body } = req;
    try {
        let data = await productService.createChildCategory(body);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: "",
        });
    }
};

const deleteChildCategory = async (req, res) => {
    const { id } = req.params;
    try {
        let data = await productService.deleteChildCategory(id);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: "",
        });
    }
};

const updateChildCategory = async (req, res) => {
    try {
        let data = await productService.updateChildCategory(req);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: "",
        });
    }
};

const getChildCategoryDetail = async (req, res) => {
    const { id } = req.params;
    try {
        let data = await productService.getChildCategoryDetail(id);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: "",
        });
    }
};

//---------- product ------------//
const listProducts = async (req, res) => {
    try {
        let data = await productService.listProducts(req);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            total: data.total,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: "",
        });
    }
};
const createProduct = async (req, res) => {
    const { body } = req;
    try {
        let data = await productService.createProduct(body);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: "",
        });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        let data = await productService.deleteProduct(id);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: "",
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        let data = await productService.updateProduct(req);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: "",
        });
    }
};

// get product detail
const getProductDetail = async (req, res) => {
    const { id } = req.params;
    try {
        let data = await productService.getProductDetail(id);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: "",
        });
    }
};

// get product favorite
const getProductFavorite = async (req, res) => {
    try {
        let data = await productService.getProductFavorite();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: "",
        });
    }
};

// --------check URL---------//
const checkURL = async (req, res) => {
    try {
        let data = await productService.checkURL(req);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: "",
        });
    }
};

// Save Information image Category, child category, product into db
const saveInfoImage = async (req, res) => {
    const files = req.files;
    const { type, id } = req.query;
    try {
        if (files.length === 0) {
            return res.status(400).json({
                EM: "upload file failed",
                EC: "-1",
                EF: "No file upload",
                DT: "",
            });
        } else {
            const temp = files.map((image) => {
                return {
                    ten_vi: image.originalname,
                    ten_en: image.originalname,
                    link: image.path,
                    type: type,
                    thumb_vi: image.filename,
                    thumb_en: image.filename,
                    id_vitri: id || 0,
                };
            });
            let data = await productService.saveInfoImage(temp);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
    } catch (error) {
        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: "",
        });
    }
};

module.exports = {
    //---together---//
    saveInfoImage,

    //---category---//
    listCategories,
    createCategory,
    deleteCategory,
    updateCategory,
    getCategoryDetail,

    //---child category---//
    listChildCategories,
    createChildCategory,
    deleteChildCategory,
    updateChildCategory,
    getChildCategoryDetail,

    //---product---//
    listProducts,
    createProduct,
    deleteProduct,
    updateProduct,
    getProductDetail,

    //---favorite product---//
    getProductFavorite,

    //---check URL---//
    checkURL,
};
