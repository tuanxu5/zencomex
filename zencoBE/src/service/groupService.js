import db from "../models";
const getAllGroup = async () => {
  try {
    const groups = await db.Group.findAll({
      order: [["name", "DESC"]],
    });
    if (groups) {
      return {
        EM: "get list group successfully",
        EC: 0,
        EF: "",
        DT: groups,
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
module.exports = {
  getAllGroup,
};
