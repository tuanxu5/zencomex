import {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../service/userServices";
const handleHello = (req, res) => {
  return res.render("home.ejs");
};
const handleUserPage = async (req, res) => {
  const userList = await getAllUser();
  return res.render("user.ejs", { userList: userList });
};

const handleGetUser = async (req, res) => {
  const { userId } = req.params;
  const user = await getUserById(userId);
  return res.render("editUser.ejs", { user: user });
};

const handleCreateUser = async (req, res) => {
  const { email, username, password } = req.body;
  await createUser(email, password, username);
  res.redirect("/user");
};

//Update USer
const handleUpdateUser = async (req, res) => {
  const { userId } = req.params;
  const { email, username } = req.body;
  await updateUser(email, username, userId);
  res.redirect("/user");
};
//Delete USer
const handleDeleteUser = async (req, res) => {
  const { userId } = req.params;
  await deleteUser(userId);
  res.redirect("/user");
};
module.exports = {
  handleHello,
  handleUserPage,
  handleCreateUser,
  handleGetUser,
  handleUpdateUser,
  handleDeleteUser,
};
