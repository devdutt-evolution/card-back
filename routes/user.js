const path = require("node:path");
const multer = require("multer");
const router = require("express").Router();
const {
  getUser,
  registerUser,
  login,
  getUsers,
  editProfile,
} = require("../controllers/users");
const {
  handleUserId,
  validateRegisterBody,
  validateLogin,
  validateEditProfile,
} = require("../controllers/users/validator");
const { validate } = require("../utils/validator");
const { checkAuth } = require("../controllers/auth");
const { reactComment } = require("../controllers/posts/comment");

// auth
router.post("/register", validateRegisterBody, validate, registerUser);
router.post("/signin", validateLogin, validate, login);

// users
router.get("/users", getUsers);
router.param("userId", handleUserId);
router.get("/user/:userId", checkAuth, getUser);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "pictures");
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}${ext}`);
  },
});

const upload = multer({ storage });

router.put(
  "/user/:userId",
  checkAuth,
  upload.single("picture"),
  (req, res, next) => {
    try {
      req.body = JSON.parse(req.body.data);
      next();
    } catch (err) {
      res.sendStatus(500);
    }
  },
  validateEditProfile,
  editProfile
);

// comment
router.put("/comments/:commentId", checkAuth, reactComment);

module.exports = router;
