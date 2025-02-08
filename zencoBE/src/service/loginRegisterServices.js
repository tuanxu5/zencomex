require("dotenv").config();
import { Op } from "sequelize";
import db from "../models";
import bcrypt from "bcryptjs";
import { getGroupWithRoles } from "../service/JWTService";
import { createJWT } from "../middleware/JWTActions";

const checkEmailExist = async (userEmail) => {
  let user = await db.User.findOne({
    where: { email: userEmail },
  });
  if (user) {
    return true;
  }
  return false;
};
const checkPhoneExist = async (userPhone) => {
  let user = await db.User.findOne({
    where: { phone: userPhone },
  });
  if (user) {
    return true;
  }
  return false;
};

const hashPassword = (pass) => {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(pass, salt);
  return hash;
};

const registerNewUser = async (rawUserData) => {
  const { email, phone, password, username } = rawUserData;
  try {
    // check email, phone number are exist
    let isEmailExist = await checkEmailExist(email);
    if (isEmailExist) {
      return {
        EM: "The email is already exist",
        EC: 1,
        EF: 1,
      };
    }
    let isPhoneExist = await checkPhoneExist(phone);
    if (isPhoneExist) {
      return {
        EM: "The phone number is already exist",
        EC: 1,
        EF: 2,
      };
    }
    //hash user password
    const passHash = hashPassword(password);

    // create new user
    await db.User.create({
      email: email,
      phone: phone,
      password: passHash,
      username: username,
      groupId: 4,
    });
    return {
      EM: "A user is created successfully",
      EC: 0,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something wrongs in services",
      EC: 2,
    };
  }
};

const checkPassword = (inputPassword, hashPassword) => {
  return bcrypt.compareSync(inputPassword, hashPassword);
};

const handleUserLogin = async (rawData) => {
  const { valueLogin, password } = rawData;
  try {
    let user = await db.User.findOne({
      where: {
        [Op.or]: [{ email: valueLogin }, { phone: valueLogin }],
      },
    });
    if (user) {
      let isCorrectPassword = checkPassword(password, user.password);
      if (isCorrectPassword) {
        //test roles
        let roles = await getGroupWithRoles(user);

        let payload = {
          email: user.email,
          username: user.username,
          groupWithRoles: roles,
        };
        let token = createJWT(payload);
        return {
          EM: "Login successfully",
          EC: 0,
          EF: "",
          DT: {
            access_token: token,
            groupWithRoles: roles,
            email: user.email,
            username: user.username,
          },
        };
      }
    }
    return {
      EM: "your email/phone number or password is incorrect",
      EC: 1,
      EF: 1,
      DT: "",
    };
  } catch (error) {}
};

module.exports = {
  registerNewUser,
  handleUserLogin,
};
