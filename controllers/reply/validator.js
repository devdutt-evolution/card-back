const { Comment } = require("../../models/comment");
const { Post } = require("../../models/post");
const { ExpressValidator } = require("express-validator");

const { body, param } = new ExpressValidator({
  checkPost: async (value) => {
    let post = await Post.countDocuments({ _id: value });
    if (post == 0) throw new Error("No such post found");
    return value;
  },
  checkComment: async (value) => {
    try {
      if (!value) throw new Error("No such comment found");
      let comment = await Comment.countDocuments({ _id: value });
      if (comment == 0) throw new Error("No such comment found");
      return value;
    } catch (err) {
      throw new Error("No such comment found");
    }
  },
});

exports.validateReplyBody = [
  param("commentId")
    .notEmpty()
    .withMessage("commentId is required")
    .checkComment(),
  body("comment").notEmpty().withMessage("comment is required"),
  body("postId").notEmpty().withMessage("postId is required").checkPost(),
];
