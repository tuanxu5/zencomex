import db from "../../models/index";
import bcrypt from "bcryptjs";
import { createJWT, verifyToken } from "../../middleware/JWTActions";
import { Op, where } from "sequelize";

const adminLogin = async (body) => {
    const { email, password } = body;
    try {
        let user = await db.table_user.findOne({
            where: { username: email },
        });
        if (!user) {
            return {
                EM: "The email is not exist", //error masage
                EC: 1, //error code
                DT: false,
            };
        }
        //compare password
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return {
                EM: "The password is incorrect", //error masage
                EC: 1, //error code
                DT: false,
            };
        }
        //create token
        let payload = {
            email: user.username,
            username: user.ten,
            quyen: user.quyen,
        };
        let token = createJWT(payload);
        return {
            EM: "Login successfully", //error masage
            EC: "0", //error code
            DT: {
                access_token: token,
                role: user.quyen,
                name: user.ten,
            },
        };
    } catch (error) {
        return {
            EM: "error from server", //error masage
            EC: "-1", //error code
            DT: false,
        };
    }
};

// check email
const checkEmailExist = async (userEmail) => {
    let user = await db.table_user.findOne({
        where: { email: userEmail },
    });
    if (user) {
        return true;
    }
    return false;
};

//hash password
const hashPassword = (pass) => {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(pass, salt);
    return hash;
};

// register
const adminRegister = async (body) => {
    const { email, password, name } = body;
    const isEmailExist = await checkEmailExist(email);
    if (isEmailExist) {
        return {
            EM: "The email is already exist", //error masage
            EC: "1", //error code
            EF: "1",
            DT: false,
        };
    }
    //hash user password
    const passHash = hashPassword(password);
    // create new user
    try {
        await db.table_user.create({
            ten: name,
            password: passHash,
            username: email,
            quyen: "admin",
        });
        return {
            EM: "A user is created successfully", //error masage
            EC: "0", //error code
            DT: true,
        };
    } catch (error) {
        return {
            EM: "error from service", //error masage
            EC: "-1", //error code
            DT: false,
        };
    }
};

// check token
const checkToken = async (body) => {
    const { token } = body;
    try {
        await verifyToken(token);
        return {
            EM: "Token is valid", //error masage
            EC: "0", //error code
            DT: true,
        };
    } catch (error) {
        return {
            EM: "Token is invalid", //error masage
            EC: "1", //error code
            DT: false,
        };
    }
};

// getList
const adminGetCategory = async (req) => {
    const categories = await db.table_product_list.findAll({
        attributes: ["id", "ten_vi", "tenkhongdau", "title", "keywords", "description"],
    });
    if (categories) {
        return {
            EM: "get list category successfully",
            EC: 0,
            DT: categories,
        };
    } else {
        return {
            EM: "something wrongs with service",
            EC: -1,
            DT: false,
        };
    }
};
const adminGetChildCategory = async (req) => {
    const { id_list } = req.query;
    const condition = {};
    if (id_list) {
        condition.id_list = parseInt(id_list);
    }
    const childCategories = await db.table_product_cat.findAll({
        where: condition,
        attributes: ["id", "id_list", "ten_vi", "tenkhongdau", "title", "keywords", "description"],
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
            DT: false,
        };
    }
};
const adminGetProduct = async (req) => {
    const { page, pageSize, name, id_list, id_cat } = req.query;
    const offset = parseInt(page * pageSize) || 0;
    const limit = parseInt(pageSize) || 20;
    const condition = {};
    if (id_list && id_list !== "undefined") {
        condition.id_list = id_list;
    }
    if (id_cat && id_cat !== "undefined") {
        condition.id_cat = id_cat;
    }
    if (name && name.length > 0) {
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
                "noibat",
                "hienthi",
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

// check exist
const checkExistUrl = async (req) => {
    const { url } = req.query;
    try {
        const danhmuc = await db.table_product_list.findOne({
            attributes: ["id", "ten_vi", "tenkhongdau"],
            where: {
                tenkhongdau: url,
            },
        });
        if (!danhmuc) {
            const danhmuccon = await db.table_product_cat.findOne({
                attributes: ["id", "ten_vi", "tenkhongdau"],
                where: {
                    tenkhongdau: url,
                },
            });
            if (!danhmuccon) {
                const baiviet = await db.table_baiviet.findOne({
                    attributes: ["id", "ten_vi", "tenkhongdau"],
                    where: {
                        tenkhongdau: url,
                    },
                });
                if (!baiviet) {
                    const sanpham = await db.table_product.findOne({
                        attributes: ["id", "ten_vi", "tenkhongdau"],
                        where: {
                            tenkhongdau: url,
                        },
                    });
                    if (!sanpham) {
                        return {
                            EM: "Url Don't exist",
                            EC: 0,
                            DT: true,
                        };
                    }
                    return {
                        EM: "Url Exist",
                        EC: 0,
                        DT: false,
                    };
                }
                return {
                    EM: "Url Exist",
                    EC: 0,
                    DT: false,
                };
            }
            return {
                EM: "Url Exist",
                EC: 0,
                DT: false,
            };
        }
        return {
            EM: "Url Exist",
            EC: 0,
            DT: false,
        };
    } catch (error) {
        return {
            EM: "something wrongs with service",
            EC: -1,
            DT: false,
        };
    }
};

export default {
    adminLogin,
    adminRegister,
    checkToken,
    adminGetCategory,
    adminGetChildCategory,
    adminGetProduct,
    checkExistUrl,
};
