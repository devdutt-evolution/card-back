const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const router = require("./routes/main");

app.use(cors());
app.use(express.json());
app.use(
  "/",
  (req, res, next) => {
    console.log(req.method.toUpperCase(), " ", req.url);
    next();
  },
  router
);

// const { Comment } = require("./models/comment");
// let a = async () => {
//   const fn = require('./test');
//   const data = await fn.a();
//   // console.log(data);
//   await Comment.create(data);
//   console.log("OK");
// };

mongoose
  .connect("mongodb://localhost:27017/demo")
  .then((data) => {
    console.log("connected DB");
    // a();
  })
  .catch((err) => console.log(err));

app.listen(3001, (err, data) => {
  if (err) console.error(err);
  console.log("Server up on 3001");
});
