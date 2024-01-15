const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
    },
    body: {
      type: String,
    },
    publishAt: {
      type: Number,
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true, versionKey: false }
);

PostSchema.index({ title: "text" });
const Post = mongoose.model("Post", PostSchema);
module.exports = { Post };
