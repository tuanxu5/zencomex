import userApiService from "../service/userApiServices";

const showUser = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let { page, limit } = req.query;
      let data = await userApiService.getUserPanigation(+page, +limit);
      // console.log("data", data);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        EF: data.EF,
        DT: data.DT,
      });
    } else {
      let data = await userApiService.getAllUser();

      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        EF: data.EF,
        DT: data.DT,
      });
    }
  } catch (error) {
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      EF: "",
      DT: "",
    });
  }
};
const createUser = async (req, res) => {
  try {
    let data = await userApiService.createNewUser(req.body);
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
const updateUser = async (req, res) => {
  try {
    let data = await userApiService.updateUser(req.body);
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
const deleteUser = async (req, res) => {
  try {
    let data = await userApiService.deleteUser(req.body.id);
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

const getUserAccount = async (req, res) => {
  return res.status(200).json({
    EM: "OK",
    EC: "0",
    EF: "",
    DT: {
      access_token: req.token,
      ...req.user,
    },
  });
};

module.exports = {
  showUser,
  createUser,
  updateUser,
  deleteUser,
  getUserAccount,
};
