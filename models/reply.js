const mongoose = require("mongoose");
const { LikeSchema } = require("./comment");

const ReplySchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Post",
    },
    commentId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Comment",
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    username: String,
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

ReplySchema.post("save", async function () {
  const { Comment } = require("../models/comment");

  await Comment.findOneAndUpdate(
    { _id: this.commentId.toString() },
    { $push: { replies: this._id.toString() } }
  );
});

const Reply = mongoose.model("Reply", ReplySchema);
module.exports = { Reply };
