import mailService from "../../service/zenco-services/mailService";

const getAllEmail = async (req, res) => {
    try {
        const data = await mailService.getAllEmail();
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
const sendEmail = async (req, res) => {
    try {
        const data = await mailService.sendEmail(req);
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
const deleteEmail = async (req, res) => {
    try {
        const data = await mailService.deleteEmail(req);
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
    sendEmail,
    getAllEmail,
    deleteEmail,
};
