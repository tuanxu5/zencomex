import groupService from "../service/groupService";
const showGroup = async (req, res) => {
  try {
    let data = await groupService.getAllGroup();
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      EF: data.EF,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      EF: "",
      DT: "",
    });
  }
};
module.exports = {
  showGroup,
};
