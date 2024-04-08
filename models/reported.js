const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Post",
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    reason: String,
  },
  { timestamps: true, versionKey: false }
);
ReportSchema.index("postId", { unique: false, name: "postwise" });

const Report = mongoose.model("Report", ReportSchema);
module.exports = { Report };
