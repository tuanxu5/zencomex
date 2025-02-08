import homeService from "../../service/zenco-services/homeService";

// ---------------Banner------------

// show banner
const showBanner = async (req, res) => {
    try {
        let data = await homeService.getAlbumBanner();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            EF: data.EF,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            EF: "",
            DT: "",
        });
    }
};

// delete banner
const deleteBanner = async (req, res) => {
    const { id } = req.params;
    try {
        let data = await homeService.deleteBanner(id);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            EF: data.EF,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            EF: "",
            DT: "",
        });
    }
};

// Update banner
const updateBanner = async (req, res) => {
    const { body } = req;
    try {
        let data = await homeService.updateBanner(body);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            EF: data.EF,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            EF: "",
            DT: "",
        });
    }
};

// upload image banner
const uploadImageBanner = async (req, res) => {
    const files = req.files;
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
                    type: "slider",
                };
            });
            const data = await homeService.addBanner(temp);
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

const uploadImageToFolder = async (req, res) => {
    const files = req.files;
    const { type, id, dir } = req.query;
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
                    photo_vi: image.filename,
                    photo_en: image.filename,
                    link: `${dir}/${image.filename}`,
                    type: type,
                    thumb_vi: image.filename,
                    thumb_en: image.filename,
                    id_vitri: id || 0,
                };
            });

            let data = await homeService.saveInfoImage(temp);
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

const deleteImageFolder = async (req, res) => {
    const { link, deletesSuccess } = req.body;
    try {
        if (!deletesSuccess) {
            return res.status(200).json({
                EM: "Delete fail",
                EC: "-1",
                DT: false,
            });
        } else {
            let data = await homeService.deleteImageFolder(link);
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

module.exports = { showBanner, uploadImageBanner, deleteBanner, updateBanner, uploadImageToFolder, deleteImageFolder };
