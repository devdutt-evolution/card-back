const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Post",
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    body: {
      type: String,
    },
    taggedUsers: {
      type: Array,
      default: [],
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true, versionKey: false }
);

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = { Comment };
