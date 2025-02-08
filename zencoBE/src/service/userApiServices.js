import db from "../models";
import bcrypt from "bcryptjs";
const getAllUser = async () => {
  try {
    const users = await db.User.findAll({
      attributes: ["id", "username", "email", "phone", "sex", "address"],
      include: { model: db.Group, attributes: ["id", "name", "description"] },

      // nest: true,
    });
    if (users) {
      return {
        EM: "get list user successfully",
        EC: 0,
        EF: "",
        DT: users,
      };
    } else {
      return {
        EM: "something wrongs with service",
        EC: 1,
        EF: "",
        DT: [],
      };
    }
  } catch (error) {}
};
const getUserPanigation = async (page, limit) => {
  try {
    const { count, rows } = await db.User.findAndCountAll({
      attributes: ["id", "username", "email", "phone", "sex", "address"],
      include: { model: db.Group, attributes: ["id", "name", "description"] },
      offset: (page - 1) * limit,
      limit: limit,
      subQuery: false,
      // nest: true,
    });
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPage: totalPages,
      users: rows,
    };
    if (data) {
      return {
        EM: "get list user successfully",
        EC: 0,
        EF: "",
        DT: data,
      };
    } else {
      return {
        EM: "something wrongs with service",
        EC: 1,
        EF: "",
        DT: [],
      };
    }
  } catch (error) {}
};

// hash password
var salt = bcrypt.genSaltSync(10);
const hashPassword = (pass) => {
  var hash = bcrypt.hashSync(pass, salt);
  return hash;
};
const createNewUser = async (data) => {
  const passHash = hashPassword(data.password);
  try {
    let res = await db.User.create({ ...data, password: passHash });
    return {
      EM: "create user successfully",
      EC: 0,
      EF: "",
      DT: [],
    };
  } catch (error) {
    return {
      EM: "something wrongs with service",
      EC: 1,
      EF: "",
      DT: [],
    };
  }
};

const updateUser = async (data) => {
  const { id, body } = data;
  try {
    let user = await db.User.findOne({
      where: { id: id },
    });
    if (user) {
      await db.User.update(
        { ...body, password: user.password },
        { where: { id: id } }
      );
      return {
        EM: "Update user successfully",
        EC: 0,
        EF: "",
        DT: [],
      };
    } else {
      return {
        EM: "user is not exist",
        EC: 2,
        EF: "",
        DT: [],
      };
    }
  } catch (error) {
    return {
      EM: "something wrongs with service",
      EC: 1,
      EF: "",
      DT: [],
    };
  }
};

const deleteUser = async (id) => {
  try {
    let user = await db.User.findOne({
      where: { id: id },
    });
    if (user) {
      await user.destroy();
      return {
        EM: "delete user succeeds",
        EC: 0,
        EF: "",
        DT: [],
      };
    } else {
      return {
        EM: "user not exist",
        EC: 2,
        EF: "",
        DT: "",
      };
    }
  } catch (error) {
    return {
      EM: "something wrongs with service",
      EC: 1,
      EF: "",
      DT: "",
    };
  }
};
module.exports = {
  getAllUser,
  createNewUser,
  updateUser,
  deleteUser,
  getUserPanigation,
};
