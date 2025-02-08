import { where } from "sequelize";
import db from "../../models/index";

const createFooter = async (req) => {
    const { data } = req.body;
    try {
        const res = await db.table_company.create(data);
        if (res) {
            return {
                EM: "create successfully",
                EC: 0,
                DT: true,
            };
        }
    } catch (error) {
        return {
            EM: "something wrongs with service",
            EC: "-1",
            DT: false,
        };
    }
};

const getFooter = async (req) => {
    const { type, tenkhongdau } = req.query;
    const condition = {};
    if (type) {
        condition.type = type;
    }
    if (tenkhongdau) {
        condition.tenkhongdau = tenkhongdau;
    }
    try {
        const res = await db.table_company.findAll({
            attributes: [
                "id",
                "type",
                "ten_vi",
                "noidung_vi",
                "tenkhongdau",
                "stt",
                "title",
                "keywords",
                "description",
            ],
            where: condition,
            order: [["stt", "ASC"]],
        });

        if (res) {
            if (type) {
                if (res.length > 0) {
                    if (!tenkhongdau) {
                        return {
                            EM: "get successfully",
                            EC: 0,
                            DT: res,
                        };
                    } else {
                        const newData = {
                            id: res[0].id,
                            title: res[0].ten_vi,
                            alias: res[0].tenkhongdau,
                            titleSeo: res[0].title,
                            keywordSeo: res[0].keywords,
                            descriptionSeo: res[0].description,
                            type: res[0].tenkhongdau,
                        };

                        return {
                            EM: "get successfully",
                            EC: 0,
                            DT: newData,
                        };
                    }
                } else {
                    return {
                        EM: "Get success but empty",
                        EC: 0,
                        DT: false,
                    };
                }
            } else {
                const support = await db.table_baiviet.findAll({
                    where: {
                        type: "chinh-sach-ho-tro",
                    },
                    attributes: ["id", "ten_vi", "tenkhongdau"],
                });
                const intro = await db.table_baiviet.findOne({
                    where: {
                        type: "trang-chu",
                    },
                    attributes: ["id", "ten_vi", "tenkhongdau", "noidung_vi"],
                });
                let result = {};
                const data = [...res];
                if (data.length > 0) {
                    // Filtering data based on type
                    const offices = data.filter((i) => i.type === "office");
                    const factories = data.filter((i) => i.type === "factory");
                    const tax = data.filter((i) => i.type === "tax");
                    const email = data.filter((i) => i.type === "email");
                    const hotline = data.filter((i) => i.type === "hotline");
                    const socials = data.filter((i) => i.type === "social");
                    const sales = data.filter((i) => i.type === "sale");
                    const certification = data.filter((i) => i.type === "certification");
                    const menu = data.filter((i) => i.type === "menu");
                    const effect = data.filter((i) => i.type === "effect");
                    const logo = data.filter((i) => i.type === "logo");

                    // Correctly merging arrays into overview using concat
                    result = {
                        overview: tax.concat(offices, factories, email, hotline),
                        socials: socials,
                        sales: sales,
                        certification: certification,
                        menu: menu,
                        effect: effect,
                        logo: logo,
                    };
                    if (support) {
                        result.policies = support;
                    }
                    if (intro) {
                        result.intro = intro;
                    }
                }
                return {
                    EM: "get successfully",
                    EC: 0,
                    DT: result,
                };
            }
        }
    } catch (error) {
        return {
            EM: "something wrongs with service",
            EC: "-1",
            DT: false,
        };
    }
};

const deleteFooter = async (req) => {
    const { id } = req.params;
    try {
        const res = await db.table_company.destroy({
            where: {
                id,
            },
        });
        if (res) {
            return {
                EM: "delete successfully",
                EC: 0,
                DT: true,
            };
        }
    } catch (error) {
        return {
            EM: "something wrongs with service",
            EC: "-1",
            DT: false,
        };
    }
};

const updateFooter = async (req) => {
    const { id } = req.params;
    const { body } = req;
    try {
        const res = await db.table_company.update(body, {
            where: {
                id,
            },
        });
        if (res) {
            return {
                EM: "update successfully",
                EC: 0,
                DT: true,
            };
        }
    } catch (error) {
        return {
            EM: "something wrongs with service",
            EC: "-1",
            DT: false,
        };
    }
};

module.exports = {
    createFooter,
    getFooter,
    deleteFooter,
    updateFooter,
};
