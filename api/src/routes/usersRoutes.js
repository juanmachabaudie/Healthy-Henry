const { Router } = require("express");
const {
  // createUser,
  getUsers,
  updateUser,
  changeAdmin,
  userProfile,
  login,
  deleteUser,
  sendOrder,
} = require("../controllers/usersController");

const router = Router();

// router.post("/create", createUser);
router.get("/", getUsers);
router.put("/update", updateUser);
router.put('/changeAdmin', changeAdmin)
router.delete("/delete", deleteUser);
router.get("/profile/:userUuid", userProfile);
router.post("/login", login);
router.post("/send-order", sendOrder)

module.exports = router;
