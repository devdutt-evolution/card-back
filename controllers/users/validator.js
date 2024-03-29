const { ExpressValidator } = require("express-validator");
const { User } = require("../../models/user");
const { ObjectId } = require("mongoose").Types;

const { body } = new ExpressValidator({
  uniqueUserName: async (value) => {
    let user = await User.countDocuments({ username: value });

    if (user > 0) throw new Error("Username already taken.");
    return value;
  },
  uniqueEmail: async (value) => {
    let user = await User.countDocuments({ email: value });

    if (user > 0) throw new Error("Email is already registered.");
    return value;
  },
  emailShouldExist: async (value) => {
    let user = await User.countDocuments({ email: value });

    if (user == 0) throw new Error("Email is not registered.");
    return value;
  },
  checkForPlus: (value) => {
    if (value.indexOf("+") == -1) return value;
    throw new Error("only enter phone number withour country code");
  },
});

exports.handleUserId = (req, res, next, userId) => {
  try {
    req.params.userId = new ObjectId(userId);
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid User Id." });
    return;
  }
};

exports.validateRegisterBody = [
  body("username")
    .notEmpty()
    .withMessage("username is required")
    .uniqueUserName(),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("enter a valid email")
    .uniqueEmail(),
  body("password").notEmpty().withMessage("password is required"),
];

exports.validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("enter a valid email")
    .emailShouldExist(),
  body("password").notEmpty().withMessage("password is required"),
  body("fcmToken").notEmpty().withMessage("fcm token is required"),
];

exports.validateEditProfile = [
  body("name")
    .notEmpty()
    .withMessage("User name is required")
    .isAlpha("en-US")
    .withMessage("only alphabates are allowed in username"),
  body("phone")
    .checkForPlus()
    .isInt()
    .withMessage("alphabates or special chars are not allowed in phone number"),
];
