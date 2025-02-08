import adminService from "../../service/zenco-services/adminService";

const adminLogin = async (req, res) => {
    try {
        const data = await adminService.adminLogin(req.body);
        //set cookie
        if (data && data.DT && data.DT.access_token) {
            res.cookie("jwt", data.DT.access_token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000,
            });
        }
        return res.status(200).json({
            EM: data.EM, //error masage
            EC: data.EC, //error code
            EF: data.EF,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: "error from server", //error masage
            EC: "-1", //error code
            DT: "",
        });
    }
};

const adminRegister = async (req, res) => {
    try {
        const data = await adminService.adminRegister(req.body);
        return res.status(200).json({
            EM: data.EM, //error masage
            EC: data.EC, //error code
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: "error from server", //error masage
            EC: "-1", //error code
            DT: false,
        });
    }
};

const checkToken = async (req, res) => {
    try {
        const data = await adminService.checkToken(req.body);
        return res.status(200).json({
            EM: data.EM, //error masage
            EC: data.EC, //error code
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: "error from server", //error masage
            EC: "-1", //error code
            DT: false,
        });
    }
};

const adminLogout = async (req, res) => {
    try {
        res.clearCookie("jwt");
        return res.status(200).json({
            EM: "Logout success", //error masage
            EC: "0", //error code
            DT: true,
        });
    } catch (error) {
        return res.status(500).json({
            EM: "error from server", //error masage
            EC: "-1", //error code
            DT: false,
        });
    }
};

const adminGetCategory = async (req, res) => {
    try {
        let data = await adminService.adminGetCategory(req);
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
const adminGetChildCategory = async (req, res) => {
    try {
        let data = await adminService.adminGetChildCategory(req);
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
const adminGetProduct = async (req, res) => {
    try {
        let data = await adminService.adminGetProduct(req);
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
const checkExistUrl = async (req, res) => {
    try {
        let data = await adminService.checkExistUrl(req);
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
    adminLogin,
    adminRegister,
    checkToken,
    adminLogout,
    adminGetCategory,
    adminGetChildCategory,
    adminGetProduct,
    checkExistUrl,
};
