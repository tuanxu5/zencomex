import generalService from "../../service/zenco-services/generalService";

const getInfoGeneral = async (req, res) => {
    try {
        const data = await generalService.getInfoGeneral(req);
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
const getAllTag = async (req, res) => {
    try {
        const data = await generalService.getAllTag(req);
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

const updateIntroductCompany = async (req, res) => {
    try {
        const data = await generalService.updateIntroductCompany(req);
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

const createGeneral = async (req, res) => {
    try {
        const data = await generalService.createGeneral(req);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: "",
        });
    }
};

const updateGeneral = async (req, res) => {
    try {
        const data = await generalService.updateGeneral(req);
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

const deleteGeneral = async (req, res) => {
    try {
        const data = await generalService.deleteGeneral(req);
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
        let data = await generalService.checkURL(req);
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
const getPageSeo = async (req, res) => {
    try {
        let data = await generalService.getPageSeo();
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
    getInfoGeneral,
    updateIntroductCompany,
    createGeneral,
    updateGeneral,
    deleteGeneral,
    checkURL,
    getPageSeo,
    getAllTag,
};
