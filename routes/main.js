const router = require("express").Router();
const {
  getPost,
  getPosts,
  createComment,
  createPost,
} = require("../controllers/posts/index");
const { getUser, registerUser, login } = require("../controllers/users/index");
const {
  validateCommentBody,
  validatePostBody,
  handlePostId,
} = require("../controllers/posts/validator");
const {
  handleUserId,
  validateRegisterBody,
  validateLogin,
} = require("../controllers/users/validator");
const { validate } = require("../utils/validator");
const { checkAuth } = require("../controllers/auth/index");

router.post("/posts", checkAuth, validatePostBody, validate, createPost);
router.get("/posts", checkAuth, getPosts);

router.param("postId", handlePostId);
router.get("/posts/:postId", checkAuth, getPost);
router.post(
  "/posts/:postId/comment",
  checkAuth,
  validateCommentBody,
  validate,
  createComment
);

router.post("/register", validateRegisterBody, validate, registerUser);
router.post("/signin", validateLogin, validate, login);

router.param("userId", handleUserId);
router.get("/user/:userId", checkAuth, getUser);

module.exports = router;
