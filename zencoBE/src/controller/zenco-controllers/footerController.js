import footerService from "../../service/zenco-services/footerService";

const createFooter = async (req, res) => {
    try {
        const data = await footerService.createFooter(req);
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

const getFooter = async (req, res) => {
    try {
        const data = await footerService.getFooter(req);
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

const deleteFooter = async (req, res) => {
    try {
        const data = await footerService.deleteFooter(req);
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

const updateFooter = async (req, res) => {
    try {
        const data = await footerService.updateFooter(req);
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

export default {
    createFooter,
    getFooter,
    deleteFooter,
    updateFooter,
};
