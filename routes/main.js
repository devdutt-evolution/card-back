const router = require("express").Router();
const {
  getPost,
  getPosts,
  createComment,
  createPost,
} = require("../controllers/posts/index");
const { getUser } = require("../controllers/users/index");
const {
  validateCommentBody,
  validatePostBody,
  handlePostId,
} = require("../controllers/posts/validator");
const { handleUserId } = require("../controllers/users/validator");
const { validate } = require("../utils/validator");

router.post("/posts", validatePostBody, validate, createPost);
router.get("/posts", getPosts);

router.param("postId", handlePostId);
router.get("/posts/:postId", getPost);
router.post(
  "/posts/:postId/comment",
  validateCommentBody,
  validate,
  createComment
);

router.param("userId", handleUserId);
router.get("/user/:userId", getUser);

module.exports = router;
