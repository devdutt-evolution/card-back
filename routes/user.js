const router = require("express").Router();
const { getUser, registerUser, login } = require("../controllers/users/index");
const {
  handleUserId,
  validateRegisterBody,
  validateLogin,
} = require("../controllers/users/validator");
const { validate } = require("../utils/validator");
const { checkAuth } = require("../controllers/auth/index");
const { reactComment } = require("../controllers/posts");

router.post("/register", validateRegisterBody, validate, registerUser);
router.post("/signin", validateLogin, validate, login);

router.param("userId", handleUserId);
router.get("/user/:userId", checkAuth, getUser);

router.put("/comments/:commentId", checkAuth, reactComment);

module.exports = router;
