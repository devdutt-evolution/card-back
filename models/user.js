const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    hash: {
      type: String,
    },
    username: {
      type: String,
    },
    phone: {
      type: String,
    },
    website: {
      type: String,
    },
    email: {
      type: String,
    },
    company: {
      name: String,
      catchPhrase: String,
      bs: String,
    },
    address: {
      street: String,
      suite: String,
      city: String,
      zipcode: String,
      geo: {
        lat: String,
        lng: String,
      },
    },
  },
  { timestamps: true, versionKey: false }
);

const User = mongoose.model("User", UserSchema);
module.exports = { User };
