const mongoose = require("mongoose");
const { LikeSchema } = require("./comment");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    title: String,
    body: String,
    publishAt: Number,
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

PostSchema.index({ title: "text" });
const Post = mongoose.model("Post", PostSchema);
module.exports = { Post };
