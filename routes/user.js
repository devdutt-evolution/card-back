const router = require("express").Router();
const { getUser, registerUser, login } = require("../controllers/users/index");
const {
  handleUserId,
  validateRegisterBody,
  validateLogin,
} = require("../controllers/users/validator");
const { validate } = require("../utils/validator");
const { checkAuth } = require("../controllers/auth/index");

router.post("/register", validateRegisterBody, validate, registerUser);
router.post("/signin", validateLogin, validate, login);

router.param("userId", handleUserId);
router.get("/user/:userId", checkAuth, getUser);

module.exports = router;
