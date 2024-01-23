const router = require("express").Router();
const {
  getUser,
  registerUser,
  login,
  getUsers,
} = require("../controllers/users/index");
const {
  handleUserId,
  validateRegisterBody,
  validateLogin,
} = require("../controllers/users/validator");
const { validate } = require("../utils/validator");
const { checkAuth } = require("../controllers/auth/index");
const {
  reactComment,
  getNotifications,
  markNotificationSeen,
} = require("../controllers/posts");

// auth
router.post("/register", validateRegisterBody, validate, registerUser);
router.post("/signin", validateLogin, validate, login);

// users
router.get("/users", getUsers);
router.param("userId", handleUserId);
router.get("/user/:userId", checkAuth, getUser);

// comment
router.put("/comments/:commentId", checkAuth, reactComment);

// notification
router.get("/notifications", checkAuth, getNotifications);
router.put("/notifications", checkAuth, markNotificationSeen);

module.exports = router;
