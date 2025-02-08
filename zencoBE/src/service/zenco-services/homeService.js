import { Op } from "sequelize";
import db from "../../models";
import cloudinary from "cloudinary";

//-------------banner----------------
//get list banner
const getAlbumBanner = async () => {
    try {
        const banner = await db.table_photo.findAll({
            where: {
                type: "banner",
                isDelete: false,
            },
            attributes: ["id", "ten_vi", "link", "stt"],
            order: [["stt", "ASC"]],
        });
        if (banner) {
            return {
                EM: "get list banner successfully",
                EC: 0,
                DT: banner,
            };
        } else {
            return {
                EM: "something wrongs with service",
                EC: -1,
                DT: [],
            };
        }
    } catch (error) {}
};

//add banner
const addBanner = async (data) => {
    try {
        const banner = await db.table_photo.bulkCreate(data);
        if (banner) {
            return {
                EM: "add banner successfully",
                EC: 0,
                DT: banner,
            };
        } else {
            return {
                EM: "something wrongs with service",
                EC: -1,
                DT: [],
            };
        }
    } catch (error) {}
};

//update banner
const updateBanner = async (body) => {
    const updates = [...body.data];
    try {
        const bannersSuccess = [];
        const bannersError = [];
        for (const update of updates) {
            const { id, data } = update;
            await db.table_photo
                .update(data, { where: { id } })
                .then(() => {
                    bannersSuccess.push(id);
                })
                .catch((error) => {
                    bannersError.push(id);
                });
        }
        if (bannersSuccess.length > 0) {
            return {
                EM: "update banner successfully",
                EC: 0,
                DT: `Record ${bannersSuccess} updated successfully!`,
            };
        }
        if (bannersError.length > 0) {
            return {
                EM: "banner not exist",
                EC: 2,
                DT: `Record ${bannersError} updated successfully!`,
            };
        }
    } catch (error) {
        return {
            EM: "something wrongs with service",
            EC: 1,
            DT: "",
        };
    }
};

// delete banner
const deleteBanner = async (id) => {
    try {
        let banner = await db.table_photo.findOne({
            where: { id: id },
        });
        if (banner) {
            const result = await cloudinary.v2.uploader.destroy(banner.thumb_vi);
            await banner.destroy();
            return {
                EM: `delete banner successfully and delete image on cloudinary ${result.result}`,
                EC: 0,
                DT: [],
            };
        } else {
            return {
                EM: "banner not exist",
                EC: 2,
                DT: "",
            };
        }
    } catch (error) {
        return {
            EM: "something wrongs with service",
            EC: 1,
            DT: "",
        };
    }
};

const saveInfoImage = async (data) => {
    try {
        const image = await db.table_photo.bulkCreate(data);
        if (image) {
            return {
                EM: "add image successfully",
                EC: 0,
                DT: image,
            };
        } else {
            return {
                EM: "something wrongs with service",
                EC: -1,
                DT: false,
            };
        }
    } catch (error) {
        console.log(error);
    }
};
const deleteImageFolder = async (link) => {
    try {
        const image = await db.table_photo.destroy({
            where: {
                link: {
                    [Op.in]: link,
                },
            },
        });
        if (image) {
            return {
                EM: "delete image successfully",
                EC: 0,
                DT: image,
            };
        } else {
            return {
                EM: "something wrongs with service",
                EC: -1,
                DT: false,
            };
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getAlbumBanner,
    addBanner,
    deleteBanner,
    updateBanner,
    saveInfoImage,
    deleteImageFolder,
};
