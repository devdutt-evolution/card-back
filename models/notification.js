const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    title: String,
    description: String,
    url: String,
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = { Notification };
