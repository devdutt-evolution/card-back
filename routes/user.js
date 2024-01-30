const router = require("express").Router();
const userHandler = require("../controllers/users");
const userValidator = require("../controllers/users/validator");
const { validate } = require("../utils/validator");
const { checkAuth } = require("../controllers/auth");
const { reactComment } = require("../controllers/posts/comment");
const { middlewares } = require("../utils/uploader");

// auth
router.post(
  "/register",
  userValidator.validateRegisterBody,
  validate,
  userHandler.registerUser
);
router.post(
  "/signin",
  validateLogin.validateLogin,
  validate,
  userHandler.login
);

// users
router.get("/users", userHandler.getUsers);
router.param("userId", userValidator.handleUserId);
router.get("/user/:userId", checkAuth, userHandler.getUser);

router.put(
  "/user/:userId",
  checkAuth,
  [...middlewares],
  validateLogin.validateEditProfile,
  userHandler.editProfile
);

// comment
router.put("/comments/:commentId", checkAuth, reactComment);

module.exports = router;
