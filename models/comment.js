const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Post",
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
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true, versionKey: false }
);

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = { Comment };
