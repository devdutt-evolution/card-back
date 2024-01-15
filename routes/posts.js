const router = require("express").Router();
const {
  getPost,
  getPosts,
  createComment,
  createPost,
  likePost,
  unlikePost,
  getLikes,
} = require("../controllers/posts/index");
const {
  validateCommentBody,
  validatePostBody,
  handlePostId,
} = require("../controllers/posts/validator");
const { validate } = require("../utils/validator");
const { checkAuth } = require("../controllers/auth/index");

router.post("/", checkAuth, validatePostBody, validate, createPost);
router.get("/", checkAuth, getPosts);

router.param("postId", handlePostId);
router.get("/:postId", checkAuth, getPost);
router.get("/:postId/likes", checkAuth, getLikes);
router.get("/:postId/like", checkAuth, likePost);
router.get("/:postId/unlike", checkAuth, unlikePost);
router.post(
  "/:postId/comment",
  checkAuth,
  validateCommentBody,
  validate,
  createComment
);

module.exports = router;
