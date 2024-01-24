const router = require("express").Router();
const {
  getUser,
  registerUser,
  login,
  getUsers,
} = require("../controllers/users");
const {
  handleUserId,
  validateRegisterBody,
  validateLogin,
} = require("../controllers/users/validator");
const { validate } = require("../utils/validator");
const { checkAuth } = require("../controllers/auth");
const { reactComment } = require("../controllers/posts/comment");

// auth
router.post("/register", validateRegisterBody, validate, registerUser);
router.post("/signin", validateLogin, validate, login);

// users
router.get("/users", getUsers);
router.param("userId", handleUserId);
router.get("/user/:userId", checkAuth, getUser);

// comment
router.put("/comments/:commentId", checkAuth, reactComment);

module.exports = router;
