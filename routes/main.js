const router = require("express").Router();
const userRouter = require("./user");
const postRouter = require("./posts");
const notificationRouter = require("./notifications");

router.use("/", userRouter);
router.use("/posts", postRouter);
router.use("/notifications", notificationRouter);

module.exports = router;
