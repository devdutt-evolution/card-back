const router = require("express").Router();
const replyHandler = require("../controllers/reply");
const { validateReplyBody } = require("../controllers/reply/validator");
const { validate } = require("../utils/validator");
const { checkAuth } = require("../controllers/auth");

router.post(
  "/:commentId",
  checkAuth,
  validateReplyBody,
  validate,
  replyHandler.createReply
);

module.exports = router;
