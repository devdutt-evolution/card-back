const router = require("express").Router();
const userRouter = require("./user");
const postRouter = require("./posts");
router.use("/", userRouter);
router.use("/posts", postRouter);

module.exports = router;
