const path = require("node:path");
const multer = require("multer");

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

const middlewares = [
  upload.single("picture"),
  (req, res, next) => {
    try {
      req.body = JSON.parse(req.body.data);
      next();
    } catch (err) {
      res.sendStatus(500);
    }
  },
];

module.exports = { middlewares };
