import db from "../models";
import bcrypt from "bcryptjs";

// hash password
var salt = bcrypt.genSaltSync(10);
const hashPassword = (pass) => {
  var hash = bcrypt.hashSync(pass, salt);
  return hash;
};
// check password
const checkPassword = (pass, passHash) => {
  return bcrypt.compareSync(pass, passHash);
};
const createUser = async (email, password, username) => {
  const passHash = hashPassword(password);
  await db.User.create({
    email: email,
    password: passHash,
    username: username,
  });
};
const updateUser = async (email, username, userId) => {
  await db.User.update(
    {
      email: email,
      username: username,
    },
    {
      where: {
        id: userId,
      },
    }
  );
  //   return await db.User.save();
};
const deleteUser = async (userId) => {
  await db.User.destroy({
    where: {
      id: userId,
    },
  });
  //   return await db.User.save();
};

const getAllUser = async (req, res) => {
  // test relationship
  let newUser = await db.User.findOne({
    where: { id: 1 },
    attributes: ["id", "username", "email"],
    include: db.Group,
    raw: true,
    nest: true,
  });
  // let roles = await db.Role.findAll({
  //   include: {
  //     model: db.Group,
  //     attributes: ["id", "name", "description"],
  //     where: { id: 1 },
  //   },
  //   raw: true,
  //   nest: true,
  // });

  const users = await db.User.findAll();
  return users;
};
const getUserById = async (userId) => {
  const user = await db.User.findOne({
    where: {
      id: userId,
    },
  });
  return user.get({ plain: true });
};

module.exports = {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
};
