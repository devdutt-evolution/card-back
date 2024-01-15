const router = require("express").Router();
const {
  getPost,
  getPosts,
  createComment,
  createPost,
  getLikes,
  reactPost,
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
router.put("/:postId/react", checkAuth, reactPost);
router.post(
  "/:postId/comment",
  checkAuth,
  validateCommentBody,
  validate,
  createComment
);

module.exports = router;
