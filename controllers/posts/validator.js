const { body } = require("express-validator");
const { ObjectId } = require("mongoose").Types;

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
];

exports.validateCommentBody = [
  body("name").notEmpty().withMessage("name is required").isString(),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("enter a valid email"),
  body("body")
    .notEmpty()
    .withMessage("body is required")
    .isString()
    .isLength(15)
    .withMessage("body is should be atleast 15 characters long"),
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
