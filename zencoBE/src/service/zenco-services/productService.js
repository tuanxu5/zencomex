import { Op, where } from "sequelize";
import db from "../../models";

//--------------Category----------------------//
const listCategories = async (req) => {
    if (JSON.stringify(req.query) === "{}") {
        const categories = await db.table_product_list.findAll({
            attributes: ["id", "ten_vi", "tenkhongdau"],
            where: {
                hienthi: true,
            },
        });
        if (categories) {
            const newData = await Promise.all(
                categories.map(async (cate) => {
                    // Fetch child categories or related products based on the current category's id
                    const childProduct = await db.table_product.findAll({
                        where: {
                            id_list: cate.id, // Match the current category's id
                            hienthi: true,
                        },
                        attributes: ["id", "ten_vi", "mota_vi", "photo", "tenkhongdau", "masp"], // Define the attributes to fetch
                        offset: 0,
                        limit: 5, // Limit the number of child categories fetched
                    });
                    const childCategory = await db.table_product_cat.findAll({
                        where: {
                            id_list: cate.id, // Match the current category's id
                            hienthi: true,
                        },
                        attributes: ["id", "ten_vi", "tenkhongdau"],
                    });

                    // Return the category with the fetched children attached
                    return {
                        id: cate.id,
                        ten_vi: cate.ten_vi,
                        tenkhongdau: cate.tenkhongdau,
                        children: childCategory.map((i) => {
                            return {
                                id: i.id,
                                title: i.ten_vi,
                                alias: i.tenkhongdau,
                            };
                        }), // Attach the fetched children
                        childrenProduct: childProduct.map((i) => {
                            return {
                                id: i.id,
                                name: i.ten_vi,
                                description: i.mota_vi,
                                image: i.photo,
                                alias: i.tenkhongdau,
                            };
                        }), // Attach the fetched children
                    };
                })
            );
            return {
                EM: "get list categories successfully",
                EC: 0,
                DT: newData,
            };
        } else {
            return {
                EM: "something wrongs with service",
                EC: -1,
                DT: false,
            };
        }
    } else {
        const { page, pageSize, name } = req.query;
        const offset = parseInt(page * pageSize);
        const limit = parseInt(pageSize);
        try {
            const { rows: categories, count: total } = await db.table_product_list.findAndCountAll({
                where: {
                    ten_vi: {
                        [Op.like]: `%${name}%`,
                    },
                },
                attributes: [
                    "id",
                    "ten_vi",
                    "mota_vi",
                    "photo",
                    "tenkhongdau",
                    "noibat",
                    "hienthi",
                    "title",
                    "keywords",
                    "description",
                ],
                offset: offset,
                limit: limit,
            });
            if (categories) {
                return {
                    EM: "get list categories successfully",
                    EC: 0,
                    total,
                    DT: categories,
                };
            } else {
                return {
                    EM: "something wrongs with service",
                    EC: -1,
                    DT: [],
                };
            }
        } catch (error) {}
    }
};
const createCategory = async (body) => {
    const idImageEditor = body.imageEditor.map((item) => item.id);
    try {
        const category = await db.table_product_list.create(body);
        if (idImageEditor.length > 0) {
            await db.table_photo.update(
                {
                    id_vitri: category.id,
                },
                {
                    where: {
                        id: {
                            [Op.in]: idImageEditor,
                        },
                    },
                }
            );
        }

        if (category) {
            return {
                EM: "add category successfully",
                EC: 0,
                DT: category,
            };
        } else {
            return {
                EM: "something wrongs with service",
                EC: -1,
                DT: [],
            };
        }
    } catch (error) {
        console.log("error", error);
    }
};
const deleteCategory = async (id) => {
    try {
        const category = await db.table_product_list.destroy({
            where: { id },
        });
        if (category) {
            return {
                EM: "delete category successfully",
                EC: 0,
                DT: category,
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
const updateCategory = async (req) => {
    const { id } = req.params;
    const { body } = req;
    try {
        const category = await db.table_product_list.update(body, {
            where: { id: id },
        });
        if (category) {
            return {
                EM: "update category successfully",
                EC: 0,
                DT: category,
            };
        } else {
            return {
                EM: "something wrongs with service",
                EC: -1,
                DT: [],
            };
        }
    } catch (error) {
        console.log("error", error);
    }
};

const getCategoryDetail = async (id) => {
    try {
        const category = await db.table_product_list.findOne({
            where: { id },
        });
        if (category) {
            return {
                EM: "get category detail successfully",
                EC: 0,
                DT: category,
            };
        } else {
            return {
                EM: "something wrongs with service",
                EC: -1,
                DT: false,
            };
        }
    } catch (error) {}
};

//--------------Child Category----------------------//
const listChildCategories = async (req) => {
    if (JSON.stringify(req.query) === "{}") {
        const childCategories = await db.table_product_cat.findAll({
            attributes: ["id", "id_list", "ten_vi", "tenkhongdau"],
            where: {
                hienthi: true,
            },
        });
        if (childCategories) {
            return {
                EM: "get list childCategories successfully",
                EC: 0,
                DT: childCategories,
            };
        } else {
            return {
                EM: "something wrongs with service",
                EC: -1,
                DT: [],
            };
        }
    } else {
        const { page, pageSize, name } = req.query;
        const offset = parseInt(page * pageSize);
        const limit = parseInt(pageSize);
        try {
            const { rows: childCategories, count: total } = await db.table_product_cat.findAndCountAll({
                where: {
                    ten_vi: {
                        [Op.like]: `%${name}%`,
                    },
                },
                attributes: [
                    "id",
                    "id_list",
                    "ten_vi",
                    "mota_vi",
                    "photo",
                    "tenkhongdau",
                    "noibat",
                    "hienthi",
                    "title",
                    "keywords",
                    "description",
                ],
                offset: offset,
                limit: limit,
            });
            if (childCategories) {
                return {
                    EM: "get list childCategories successfully",
                    EC: 0,
                    total,
                    DT: childCategories,
                };
            } else {
                return {
                    EM: "something wrongs with service",
                    EC: -1,
                    DT: [],
                };
            }
        } catch (error) {}
    }
};
const createChildCategory = async (body) => {
    const idImageEditor = body.imageEditor.map((item) => item.id);
    try {
        const childCategory = await db.table_product_cat.create(body);
        if (idImageEditor.length > 0) {
            await db.table_photo.update(
                {
                    id_vitri: childCategory.id,
                },
                {
                    where: {
                        id: {
                            [Op.in]: idImageEditor,
                        },
                    },
                }
            );
        }

        if (childCategory) {
            return {
                EM: "add child category successfully",
                EC: 0,
                DT: childCategory,
            };
        } else {
            return {
                EM: "something wrongs with service",
                EC: -1,
                DT: [],
            };
        }
    } catch (error) {
        console.log("error", error);
    }
};
const deleteChildCategory = async (id) => {
    try {
        const childCategory = await db.table_product_cat.destroy({
            where: { id },
        });
        if (childCategory) {
            return {
                EM: "delete child category successfully",
                EC: 0,
                DT: childCategory,
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
const updateChildCategory = async (req) => {
    const { id } = req.params;
    const { body } = req;
    try {
        const childCategory = await db.table_product_cat.update(body, {
            where: { id: id },
        });
        if (childCategory) {
            return {
                EM: "update child category successfully",
                EC: 0,
                DT: childCategory,
            };
        } else {
            return {
                EM: "something wrongs with service",
                EC: -1,
                DT: [],
            };
        }
    } catch (error) {
        console.log("error", error);
    }
};
const getChildCategoryDetail = async (id) => {
    try {
        const childCategory = await db.table_product_cat.findOne({
            where: { id },
        });
        if (childCategory) {
            return {
                EM: "get child category detail successfully",
                EC: 0,
                DT: childCategory,
            };
        } else {
            return {
                EM: "something wrongs with service",
                EC: -1,
                DT: false,
            };
        }
    } catch (error) {}
};

//--------------Product----------------------//
const listProducts = async (req) => {
    const { page, pageSize, name, id_list, id_cat } = req.query;
    const offset = parseInt(page * pageSize) || 0;
    const limit = parseInt(pageSize) || 20;
    const condition = {
        hienthi: true,
    };
    if (id_list && id_list !== "undefined") {
        condition.id_list = id_list;
    }
    if (id_cat && id_cat !== "undefined") {
        condition.id_cat = id_cat;
    }
    if (name) {
        condition.ten_vi = {
            [Op.like]: `%${name}%`,
        };
    }

    try {
        const { rows: product, count: total } = await db.table_product.findAndCountAll({
            where: condition,
            attributes: [
                "id",
                "id_list",
                "id_cat",
                "ten_vi",
                "giaban",
                "mota_vi",
                "noidung_vi",
                "photo",
                "tenkhongdau",
                "masp",
                "title",
                "keywords",
                "description",
            ],
            offset: offset,
            limit: limit,
        });
        if (product) {
            return {
                EM: "get list product successfully",
                EC: 0,
                total,
                DT: product,
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
const createProduct = async (body) => {
    const idImageEditor = body.imageEditor.map((item) => item.id);
    const idImageNow = body.imageProductNow.map((item) => item.id);
    const idImageAttach = body.imageProductAttach.map((item) => item.id);

    try {
        const product = await db.table_product.create(body);
        if (idImageEditor.length > 0 || idImageNow.length > 0 || idImageAttach.length > 0) {
            await db.table_photo.update(
                {
                    id_vitri: product.id,
                },
                {
                    where: {
                        id: {
                            [Op.in]: idImageEditor.concat(idImageNow, idImageAttach),
                        },
                    },
                }
            );
        }

        if (product) {
            return {
                EM: "add product successfully",
                EC: 0,
                DT: product,
            };
        } else {
            return {
                EM: "something wrongs with service",
                EC: -1,
                DT: [],
            };
        }
    } catch (error) {
        console.log("error", error);
    }
};
const deleteProduct = async (id) => {
    try {
        const product = await db.table_product.destroy({
            where: { id },
        });
        if (product) {
            return {
                EM: "delete product successfully",
                EC: 0,
                DT: product,
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
const updateProduct = async (req) => {
    const { id } = req.params;
    const { body } = req;
    try {
        const product = await db.table_product.update(body, {
            where: { id: id },
        });
        if (product) {
            return {
                EM: "update product successfully",
                EC: 0,
                DT: product,
            };
        } else {
            return {
                EM: "something wrongs with service",
                EC: -1,
                DT: [],
            };
        }
    } catch (error) {
        console.log("error", error);
    }
};
// get product detail
const getProductDetail = async (id) => {
    try {
        const product = await db.table_product.findOne({
            where: { id },
        });
        if (product) {
            return {
                EM: "get product detail successfully",
                EC: 0,
                DT: product,
            };
        } else {
            return {
                EM: "something wrongs with service",
                EC: -1,
                DT: false,
            };
        }
    } catch (error) {}
};

// get product favorite
const getProductFavorite = async () => {
    try {
        const product = await db.table_product.findAll({
            where: {
                noibat: 1,
                hienthi: true,
            },
            attributes: ["id", "ten_vi", "giaban", "mota_vi", "photo", "tenkhongdau"],
            offset: 0,
            limit: 10,
        });
        if (product) {
            return {
                EM: "get list product successfully",
                EC: 0,
                DT: product,
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
        const existInCat = await db.table_product_list.findOne({
            where: { tenkhongdau: url },
            attributes: ["id", "ten_vi", "tenkhongdau", "mota_vi", "type", "title", "keywords", "description"],
        });
        const existInChild = await db.table_product_cat.findOne({
            where: { tenkhongdau: url },
            attributes: [
                "id",
                "id_list",
                "ten_vi",
                "tenkhongdau",
                "mota_vi",
                "type",
                "title",
                "keywords",
                "description",
            ],
        });
        const existInPro = await db.table_product.findOne({
            where: { tenkhongdau: url },
            attributes: [
                "id",
                "id_list",
                "id_cat",
                "ten_vi",
                "tenkhongdau",
                "giaban",
                "photo",
                "mota_vi",
                "noidung_vi",
                "type",
                "title",
                "keywords",
                "description",
            ],
        });

        if (existInCat) {
            const newData = {
                id: existInCat.id,
                title: existInCat.ten_vi,
                alias: existInCat.tenkhongdau,
                description: existInCat.mota_vi,
                titleSeo: existInCat.title,
                keywordSeo: existInCat.keywords,
                descriptionSeo: existInCat.description,
                type: "category",
            };
            return {
                EM: "url is exist",
                EC: 0,
                DT: newData,
            };
        } else if (existInChild) {
            const parent = await db.table_product_list.findOne({
                where: { id: existInChild.id_list },
                attributes: ["id", "ten_vi", "tenkhongdau", "mota_vi", "type"],
            });
            const newData = {
                id: existInChild.id,
                title: existInChild.ten_vi,
                alias: existInChild.tenkhongdau,
                description: existInChild.mota_vi,
                type: "childCategory",
                parent: {
                    id: parent.id,
                    title: parent.ten_vi,
                    alias: parent.tenkhongdau,
                    type: "category",
                },
                titleSeo: existInChild.title,
                keywordSeo: existInChild.keywords,
                descriptionSeo: existInChild.description,
            };
            return {
                EM: "url is exist",
                EC: 0,
                DT: newData,
            };
        } else if (existInPro) {
            const parent = await db.table_product_list.findOne({
                where: { id: existInPro.id_list },
                attributes: ["id", "ten_vi", "tenkhongdau", "mota_vi", "type"],
            });
            const fileAttach = await db.table_photo.findAll({
                where: {
                    id_vitri: existInPro.id,
                    type: "product_attach",
                },
                attributes: ["link"],
            });
            const newData = {
                id: existInPro.id,
                title: existInPro.ten_vi,
                alias: existInPro.tenkhongdau,
                price: existInPro.giaban,
                image: existInPro.photo,
                intro: existInPro.mota_vi,
                description: existInPro.noidung_vi,
                titleSeo: existInPro.title,
                keywordSeo: existInPro.keywords,
                descriptionSeo: existInPro.description,
                type: "product",
                parent: {
                    id: parent.id,
                    title: parent.ten_vi,
                    alias: parent.tenkhongdau,
                    type: "category",
                },
            };
            if (existInPro.id_cat !== 0) {
                const parentData = await db.table_product_cat.findOne({
                    where: { id: existInPro.id_cat },
                    attributes: ["id", "ten_vi", "tenkhongdau", "mota_vi", "type"],
                });
                newData.parentChild = {
                    id: parentData.id,
                    title: parentData.ten_vi,
                    alias: parentData.tenkhongdau,
                    type: "childCategory",
                };
            }
            if (fileAttach.length > 0) {
                newData.attach = fileAttach.map((i) => i.link);
            }
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

module.exports = {
    // ----image----//
    saveInfoImage,

    //----category----//
    listCategories,
    createCategory,
    deleteCategory,
    updateCategory,
    getCategoryDetail,

    //----child category----//
    listChildCategories,
    createChildCategory,
    deleteChildCategory,
    updateChildCategory,
    getChildCategoryDetail,

    //----product----//
    listProducts,
    createProduct,
    deleteProduct,
    updateProduct,
    getProductDetail,

    //----favorite product----//
    getProductFavorite,

    //----check URL----//
    checkURL,
};
