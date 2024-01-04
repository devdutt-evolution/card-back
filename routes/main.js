const router = require("express").Router();
const {
  getPost,
  getPosts,
  getPostHealth,
  createPost,
  validatePostBody,
} = require("../controllers/posts/index");
const { getUser } = require("../controllers/users/index");

router.post("/posts", validatePostBody, createPost);
router.get("/posts", getPosts);
router.get("/health", getPostHealth);
router.get("/posts/:postId", getPost);
router.get("/user/:userId", getUser);

module.exports = router;
