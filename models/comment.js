const mongoose = require("mongoose");
const { REACTIONS } = require("../utils/consts");

const LikeSchema = new mongoose.Schema({
  userId: String,
  reactionType: {
    type: String,
    enum: [...Object.values(REACTIONS).filter((v) => v !== "unlike")],
    default: "heart",
  },
});

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
      type: [LikeSchema],
      default: [],
    },
  },
  { timestamps: true, versionKey: false }
);

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = { Comment, LikeSchema };
