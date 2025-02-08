import db from "../../models";
import { sendMail } from "../../middleware/mail/mailer";
import { where } from "sequelize";

const sendEmail = async (req) => {
    try {
        const { body } = req;
        const data = await db.table_contact.create(body);
        if (data) {
            await sendMail(data);
            await db.table_contact.update({ sent: true }, { where: { id: data.id } });
            return {
                EM: "create new contact successfully",
                EC: 0,
                DT: true,
            };
        } else {
            return {
                EM: "create fail",
                EC: -1,
                DT: false,
            };
        }
    } catch (error) {
        return {
            EM: "something wrongs with service",
            EC: -1,
            DT: false,
        };
    }
};
const getAllEmail = async () => {
    try {
        const data = await db.table_contact.findAll({
            order: [["createdAt", "DESC"]],
        });
        if (data) {
            return {
                EM: "create new contact successfully",
                EC: 0,
                DT: data,
            };
        }
    } catch (error) {
        return {
            EM: "something wrongs with service",
            EC: -1,
            DT: false,
        };
    }
};
const deleteEmail = async (req) => {
    const { id } = req.params;
    try {
        const data = await db.table_contact.destroy({
            where: {
                id: id,
            },
        });
        if (data) {
            return {
                EM: "delete success",
                EC: 0,
                DT: true,
            };
        }
    } catch (error) {
        return {
            EM: "something wrongs with service",
            EC: -1,
            DT: false,
        };
    }
};
module.exports = {
    sendEmail,
    getAllEmail,
    deleteEmail,
};
