const crypto = require("node:crypto");
const jwt = require("jsonwebtoken");
const ITERATIONS = 30;
const LENGTH = 64;

exports.hashIt = (password) => {
  return crypto
    .pbkdf2Sync(password, process.env.SALT, ITERATIONS, LENGTH, "sha512")
    .toString("hex");
};

exports.pass = (payload) => {
  // let pair = crypto.generateKeyPairSync("rsa", { modulusLength: 512 });
  // console.log(pair.privateKey.export);
  // console.log(pair.publicKey);
  return jwt.sign(payload, process.env.SECRET, {
    expiresIn: "6h",
  });
};

exports.checkToken = (token) => {
  let result = jwt.decode(token, process.env.SECRET);

  return result;
};
