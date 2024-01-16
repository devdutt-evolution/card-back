const { ExpressValidator } = require("express-validator");
const { ObjectId } = require("mongoose").Types;

const { body } = new ExpressValidator({
  isFuture: (value) => {
    const ct = Date.now();
    if (value < ct) throw new Error("Schedule time should be set to future.");
    return value;
  },
});

exports.validatePostBody = [
  body("title")
    .notEmpty()
    .withMessage("title is required")
    .isString()
    .withMessage("title is required"),
  body("body")
    .notEmpty()
    .withMessage("body is required")
    .isString()
    .isLength(15)
    .withMessage("body should be atleat 15 chcracters"),
  body("tobePublished")
    .default(false)
    .isBoolean()
    .withMessage("tobePublished is a boolean field"),
  body("publishAt")
    .if((v, { req }) => req.body.tobePublished)
    .isNumeric()
    .withMessage("publishAt should be a timestamp")
    .isFuture(),
];

exports.validateCommentBody = [
  body("comment")
    .notEmpty()
    .withMessage("comment is required")
    .isString()
    .isLength(15)
    .withMessage("comment is should be atleast 15 characters long"),
];

exports.handlePostId = (req, res, next, postId) => {
  try {
    req.params.postId = new ObjectId(postId);
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Post Id." });
    return;
  }
};
