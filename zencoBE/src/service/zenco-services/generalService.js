import { Op, where } from "sequelize";
import db from "../../models/index";

const getInfoGeneral = async (req) => {
    const { type } = req.params;
    const { page, pageSize, tag, category } = req.query;
    const offset = parseInt(page * pageSize) || 0;
    const limit = parseInt(pageSize) || 50;

    const condition = {
        type: type,
    };
    if (tag && tag !== "") {
        condition.keywords = {
            [Op.like]: `%${tag}%`,
        };
    }
    if (category && category !== "") {
        condition.id_list = parseInt(category);
    }
    try {
        const { rows: data, count: total } = await db.table_baiviet.findAndCountAll({
            where: condition,
            attributes: [
                "id",
                "ten_vi",
                "tenkhongdau",
                "id_list",
                "noidung_vi",
                "mota_vi",
                "photo",
                "ngaytao",
                "ngaysua",
                "thumb2",
                "title",
                "keywords",
                "description",
            ],
            offset,
            limit,
            order: [
                ["ngaysua", "DESC"], // Sắp xếp theo ngaytao giảm dần
            ],
        });

        const newData = data.map((item) => {
            return {
                id: item.id,
                title: item.ten_vi,
                alias: item.tenkhongdau,
                category: item.id_list,
                description: item.noidung_vi,
                intro: item.mota_vi,
                image: item.photo,
                dateCreate: item.ngaytao,
                dateUpdate: item.ngaysua || "",
                videoUrl: item.thumb2,
                titleSeo: item.title,
                keywordSeo: item.keywords,
                descriptionSeo: item.description,
            };
        });
        return {
            EM: "get general successfully",
            EC: 0,
            total,
            DT: newData,
        };
    } catch (error) {
        return {
            EM: "something wrongs with service",
            EC: -1,
            DT: false,
        };
    }
};
const getAllTag = async (req) => {
    const { type } = req.params;
    try {
        const allKeyword = await db.table_baiviet.findAll({
            where: {
                type: type,
                keywords: {
                    [Op.ne]: "",
                },
            },
            attributes: ["keywords", "tenkhongdau"],
        });
        return {
            EM: "get general successfully",
            EC: 0,
            DT: allKeyword,
        };
    } catch (error) {
        return {
            EM: "something wrongs with service",
            EC: -1,
            DT: false,
        };
    }
};

const updateIntroductCompany = async (req) => {
    try {
        const { id } = req.params;
        const { body } = req;
        const data = await db.table_baiviet.update(body, { where: { id } });
        if (data) {
            return {
                EM: "update introduct company successfully",
                EC: 0,
                DT: data,
            };
        } else {
            return {
                EM: "update introduct company fail",
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

const createGeneral = async (req) => {
    const { body } = req;
    const idImageEditor = body.imageEditor.map((item) => item.id);
    const idImageNow = body.imageNow.map((item) => item.id);

    try {
        const data = await db.table_baiviet.create(body);
        if (idImageEditor.length > 0 || idImageNow.length > 0) {
            await db.table_photo.update(
                {
                    id_vitri: data.id,
                },
                {
                    where: {
                        id: {
                            [Op.in]: idImageEditor.concat(idImageNow),
                        },
                    },
                }
            );
        }
        if (data) {
            return {
                EM: "create successfully",
                EC: 0,
                DT: data,
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

const updateGeneral = async (req) => {
    const { id } = req.params;
    const { body } = req;
    try {
        const data = await db.table_baiviet.update(body, { where: { id } });
        if (data) {
            return {
                EM: "update successfully",
                EC: 0,
                DT: data,
            };
        } else {
            return {
                EM: "update fail",
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

const deleteGeneral = async (req) => {
    const { id } = req.params;
    try {
        const data = await db.table_baiviet.destroy({ where: { id } });
        if (data) {
            return {
                EM: "delete successfully",
                EC: 0,
                DT: true,
            };
        } else {
            return {
                EM: "delete fail",
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

//-------- check URL--------//
const checkURL = async (req) => {
    const { url } = req.body;
    if (!url) {
        return {
            EM: "url is not exist",
            EC: -1,
            DT: false,
        };
    }

    try {
        const existUrlInGeneral = await db.table_baiviet.findOne({
            where: { tenkhongdau: url },
            attributes: [
                "id",
                "ten_vi",
                "tenkhongdau",
                "type",
                "noidung_vi",
                "mota_vi",
                "photo",
                "ngaytao",
                "ngaysua",
                "thumb2",
                "title",
                "keywords",
                "description",
            ],
        });
        const newData = {
            id: existUrlInGeneral.id,
            title: existUrlInGeneral.ten_vi,
            alias: existUrlInGeneral.tenkhongdau,
            description: existUrlInGeneral.noidung_vi,
            intro: existUrlInGeneral.mota_vi,
            image: existUrlInGeneral.photo,
            dateCreate: existUrlInGeneral.ngaytao,
            dateUpdate: existUrlInGeneral.ngaysua || "",
            videoUrl: existUrlInGeneral.thumb2,
            titleSeo: existUrlInGeneral.title,
            keywordSeo: existUrlInGeneral.keywords,
            descriptionSeo: existUrlInGeneral.description,
            parent: existUrlInGeneral.type,
            type: "general",
        };
        if (existUrlInGeneral) {
            return {
                EM: "url is exist",
                EC: 0,
                DT: newData,
            };
        } else {
            return {
                EM: "url is not exist",
                EC: -1,
                DT: false,
            };
        }
    } catch (error) {}
};

const getPageSeo = async () => {
    try {
        const sanpham = await db.table_product.findAll({
            attributes: ["tenkhongdau"],
        });
        const danhmuc = await db.table_product_list.findAll({
            attributes: ["tenkhongdau"],
        });
        const danhmuccon = await db.table_product_cat.findAll({
            attributes: ["tenkhongdau"],
        });
        const baiviet = await db.table_baiviet.findAll({
            attributes: ["tenkhongdau"],
        });

        const urls = [];
        if (sanpham) {
            sanpham.forEach((product) => {
                urls.push({
                    url: `/${product.tenkhongdau}`, // Giả định đường dẫn cho sản phẩm
                    changefreq: "daily",
                    priority: 0.7,
                });
            });
        }

        // Thêm danh mục vào mảng URLs
        if (danhmuc) {
            danhmuc.forEach((category) => {
                urls.push({
                    url: `/${category.tenkhongdau}`, // Giả định đường dẫn cho danh mục
                    changefreq: "weekly",
                    priority: 0.6,
                });
            });
        }

        // Thêm danh mục con vào mảng URLs
        if (danhmuccon) {
            danhmuccon.forEach((subCategory) => {
                urls.push({
                    url: `/${subCategory.tenkhongdau}`, // Giả định đường dẫn cho danh mục con
                    changefreq: "weekly",
                    priority: 0.5,
                });
            });
        }

        // Thêm bài viết vào mảng URLs
        if (baiviet) {
            baiviet.forEach((article) => {
                urls.push({
                    url: `/${article.tenkhongdau}`, // Giả định đường dẫn cho bài viết
                    changefreq: "monthly",
                    priority: 0.4,
                });
            });
        }

        return {
            EM: "get successfully",
            EC: 0,
            DT: urls,
        };
    } catch (error) {
        return {
            EM: "something wrongs with service",
            EC: -1,
            DT: false,
        };
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
