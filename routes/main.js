const router = require("express").Router();
const userRouter = require("./user");
const postRouter = require("./posts");
const notificationRouter = require("./notifications");
const replyRouter = require("./reply");
const reportRouter = require("./report");

router.use("/", userRouter);
router.use("/posts", postRouter);
router.use("/notifications", notificationRouter);
router.use("/reply", replyRouter);
router.use("/reports", reportRouter);

module.exports = router;
