const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const router = require("./routes/main");
const { logger } = require("./utils/logger.js");
const { resolve, join } = require("path");
const swaggerDocs = require("./swagger.js");
require("dotenv").config({ path: resolve(__dirname, "./.env") });
// require("dotenv").config({ path: resolve(__dirname, "../.env") });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const postersFolderPath = join(__dirname, "pictures");
// Set up a route to serve static files from the pictures folder
app.use("/pictures", express.static(postersFolderPath));
app.use("/", logger, router);

app.listen(3001, (err, data) => {
  if (err) console.error(err);
  console.log("Server up on 3001");
  require("./cron");
});

mongoose
  .connect(process.env.DB_URL)
  .then((data) => {
    console.log("connected DB");
    // app.listen(3001, (err, data) => {
    //   if (err) console.error(err);
    //   console.log("Server up on 3001");
    //   require("./cron");
    // });
    swaggerDocs(app, 3001);
  })
  .catch((err) => console.log(err));
