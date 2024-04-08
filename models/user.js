const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    hash: String,
    username: String,
    token: String,
    phone: String,
    picture: String,
    email: String,
    admin: Boolean,
  },
  { timestamps: true, versionKey: false }
);

UserSchema.index({ username: "text" });
const User = mongoose.model("User", UserSchema);
module.exports = { User };
