const mongoose = require("mongoose");
const { REACTIONS } = require("../utils/consts");

const LikeSchema = new mongoose.Schema({
  userId: String,
  reactionType: {
    type: String,
    enum: [...Object.values(REACTIONS).filter((v) => v !== REACTIONS.UNLIKE)],
    default: REACTIONS.HEART,
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
    name: String,
    email: String,
    body: String,
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
