const router = require("express").Router();
const postHandler = require("../controllers/posts");
const commentHandler = require("../controllers/posts/comment");
const postValidator = require("../controllers/posts/validator");
const { validate } = require("../utils/validator");
const { checkAuth } = require("../controllers/auth");

router.post(
  "/",
  checkAuth,
  postValidator.validatePostBody,
  validate,
  postHandler.createPost
);
router.get("/", checkAuth, postHandler.getPosts);

router.param("postId", postValidator.handlePostId);
router.put("/:postId", checkAuth, postHandler.updatePost);
router.get("/:postId", checkAuth, postHandler.getPost);
router.get("/:postId/likes", checkAuth, postHandler.getLikes);
router.put("/:postId/react", checkAuth, postHandler.reactPost);
router.post(
  "/:postId/comment",
  checkAuth,
  postValidator.validateCommentBody,
  validate,
  commentHandler.createComment
);

module.exports = router;
