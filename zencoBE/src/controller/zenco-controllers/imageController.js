import imageService from "../../service/zenco-services/imageService";

const deleteImageByPath = async (req, res) => {
    const { link, id_vitri, type } = req.body;
    if (!link) {
        return res.status(400).json({
            EM: "link is required",
            EC: "-1",
            EF: "",
            DT: "",
        });
    }
    try {
        const data = await imageService.deleteImage(link, id_vitri || 0, type || "");
        if (data) {
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
            EF: "",
            DT: "",
        });
    }
};

const getImagesByIdVitri = async (req, res) => {
    const { id_vitri } = req.params;
    const { type } = req.query;
    if (!id_vitri) {
        return res.status(400).json({
            EM: "id_vitri is required",
            EC: "-1",
            DT: "",
        });
    }
    try {
        const data = await imageService.getImagesByIdVitri(id_vitri, type);
        if (data) {
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

const getImagesByType = async (req, res) => {
    const { type } = req.query;
    if (!type) {
        return res.status(400).json({
            EM: "type is required",
            EC: "-1",
            DT: "",
        });
    }
    try {
        const data = await imageService.getImagesByType(type);
        if (data) {
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

const getImagesByIdProduct = async (req, res) => {
    const { id_product } = req.params;
    if (!id_product) {
        return res.status(400).json({
            EM: "id_product is required",
            EC: "-1",
            DT: "",
        });
    }
    try {
        const data = await imageService.getImagesByIdProduct(id_product);
        if (data) {
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

const createImage = async (req, res) => {
    const { images } = req.body;
    try {
        const data = await imageService.createImage(images);
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

const updateImage = async (req, res) => {
    const { body } = req.body;

    try {
        const data = await imageService.updateImage(body);
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

const updateImageById = async (req, res) => {
    try {
        const data = await imageService.updateImageById(req);
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

module.exports = {
    deleteImageByPath,
    getImagesByIdVitri,
    createImage,
    updateImage,
    updateImageById,
    getImagesByIdProduct,
    getImagesByType,
};
