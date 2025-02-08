import loginRegisterServices from "../service/loginRegisterServices";
const handleRegister = async (req, res) => {
  try {
    if (!req.body.email || !req.body.phone || !req.body.password) {
      return res.status(500).json({
        EM: "Missing required parameters", //error masage
        EC: "1", //error code
        DT: "",
      });
    }

    //service: create user
    let data = await loginRegisterServices.registerNewUser(req.body);

    return res.status(200).json({
      EM: data.EM, //error masage
      EC: data.EC, //error code
      EF: data.EF,
      DT: "",
    });
  } catch (error) {
    return res.status(500).json({
      EM: "error from server", //error masage
      EC: "-1", //error code
      DT: "",
    });
  }
};

const handleLogin = async (req, res) => {
  try {
    const data = await loginRegisterServices.handleUserLogin(req.body);
    //set cookie
    if (data && data.DT && data.DT.access_token) {
      res.cookie("jwt", data.DT.access_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });
    }
    return res.status(200).json({
      EM: data.EM, //error masage
      EC: data.EC, //error code
      EF: data.EF,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "error from server", //error masage
      EC: "-1", //error code
      DT: "",
    });
  }
};
const handleLogout = (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({
      EM: "Logout success", //error masage
      EC: "0", //error code
      DT: "",
    });
  } catch (error) {
    return res.status(500).json({
      EM: "error from server", //error masage
      EC: "-1", //error code
      DT: "",
    });
  }
};
module.exports = {
  handleRegister,
  handleLogin,
  handleLogout,
};
