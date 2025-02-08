import db from "../../models";
import cloudinary from "cloudinary";
import { Op, where } from "sequelize";

const deleteImage = async (links, id_vitri, type) => {
    try {
        const condition = {
            link: {
                [Op.in]: links,
            },
            id_vitri: id_vitri,
        };
        if (type !== "") {
            condition.type = type;
        }

        // tim tat ca cac anh co link va id_vitri trong bang photo
        const images = await db.table_photo.findAll({
            where: condition,
        });
        if (images.length === 0) {
            return {
                EM: "image not found",
                EC: -1,
                DT: false,
            };
        }
        // tim tat ca cac anh co link trong bang photo
        const allImages = await db.table_photo.findAll({
            where: {
                link: {
                    [Op.in]: links,
                },
            },
        });

        // nhom cac anh theo link
        const imagesGroupedByLink = allImages.reduce((acc, image) => {
            if (!acc[image.link]) {
                acc[image.link] = [];
            }
            acc[image.link].push(image);
            return acc;
        }, {});

        const publicIdsToDelete = [];

        if (allImages.length === 1) {
            publicIdsToDelete.push(...allImages.map((image) => image.thumb_vi));
        } else {
            for (const link of links) {
                const imagesForLink = imagesGroupedByLink[link];
                const imagesAtLocationForLink = images.filter((image) => image.link === link);

                // Kiểm tra nếu tất cả các bản sao của ảnh có link đó đều thuộc về id_vitri hiện tại
                const shouldDelete = imagesForLink.length === imagesAtLocationForLink.length;

                if (shouldDelete) {
                    publicIdsToDelete.push(...imagesAtLocationForLink.map((image) => image.thumb_vi));
                }
            }
        }
        if (publicIdsToDelete && publicIdsToDelete.length > 0) {
            await cloudinary.v2.api.delete_resources(publicIdsToDelete);
        }
        await db.table_photo.destroy({
            where: condition,
        });
        return {
            EM: "delete images successfully",
            EC: 0,
            DT: images,
        };
    } catch (error) {
        return {
            EM: "something wrongs with service",
            EC: -1,
            DT: false,
        };
    }
};

const getImagesByIdVitri = async (id_vitri, type) => {
    const condition = {
        id_vitri: id_vitri,
    };
    if (type) {
        condition.type = type;
    }
    try {
        const images = await db.table_photo.findAll({
            where: condition,
            attributes: ["id", "type", "ten_vi", "link", "isdelete"],
        });
        return {
            EM: "get images successfully",
            EC: 0,
            DT: images,
        };
    } catch (error) {
        return {
            EM: "something wrongs with service",
            EC: -1,
            DT: [],
        };
    }
};

const getImagesByType = async (type) => {
    try {
        const data = await db.table_photo.findAll({
            where: {
                type: type,
                isdelete: false,
            },
            attributes: ["id", "type", "ten_vi", "link"],
        });
        return {
            EM: "get images successfully",
            EC: 0,
            DT: data,
        };
    } catch (error) {
        return {
            EM: "something wrongs with service",
            EC: -1,
            DT: false,
        };
    }
};

const getImagesByIdProduct = async (id_product) => {
    try {
        if (!db.table_product_photo) {
            throw new Error("table_product_photo is not defined in db");
        }
        const images = await db.table_product_photo.findAll({
            where: {
                id_product: id_product,
                isdelete: false,
            },
            attributes: ["id", "type", "ten_vi", "link"],
        });
        return {
            EM: "get images successfully",
            EC: 0,
            DT: images,
        };
    } catch (error) {
        return {
            EM: "something wrongs with service",
            EC: -1,
            DT: [],
        };
    }
};

const createImage = async (images) => {
    try {
        const data = await db.table_photo.bulkCreate(images);
        return {
            EM: "add images successfully",
            EC: 0,
            DT: data,
        };
    } catch (error) {
        return {
            EM: "something wrongs with service",
            EC: -1,
            DT: [],
        };
    }
};

const updateImage = async (body) => {
    const { data, id_vitri, link, type } = body;
    try {
        const image = await db.table_photo.findOne({
            where: {
                id_vitri: id_vitri,
                link: {
                    [Op.in]: link,
                },
                type: type,
            },
        });
        if (!image) {
            return {
                EM: "image not found",
                EC: -1,
                DT: [],
            };
        }
        const result = await db.table_photo.update(data, {
            where: {
                id: image.id,
            },
        });
        return {
            EM: "update image successfully",
            EC: 0,
            DT: result,
        };
    } catch (error) {
        return {
            EM: "something wrongs with service",
            EC: -1,
            DT: { error },
        };
    }
};

const updateImageById = async (req) => {
    const { id } = req.params;
    const { body } = req.body;
    try {
        const image = await db.table_photo.findOne({
            where: {
                id: id,
            },
        });
        if (!image) {
            return {
                EM: "image not found",
                EC: -1,
                DT: [],
            };
        }
        const result = await db.table_photo.update(body, {
            where: {
                id: id,
            },
        });
        return {
            EM: "update image successfully",
            EC: 0,
            DT: result,
        };
    } catch (error) {
        return {
            EM: "something wrongs with service",
            EC: -1,
            DT: { error },
        };
    }
};

module.exports = {
    deleteImage,
    getImagesByIdVitri,
    createImage,
    updateImage,
    updateImageById,
    getImagesByIdProduct,
    getImagesByType,
};
