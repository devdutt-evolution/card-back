const crypto = require("node:crypto");
const jwt = require("jsonwebtoken");
const ITERATIONS = 30;
const LENGTH = 64;

/**
 * encrypts the password creats a hash for it
 *
 * @param {string} password password to hash
 * @returns hashed password
 */
exports.hashIt = (password) => {
  return crypto
    .pbkdf2Sync(password, process.env.SALT, ITERATIONS, LENGTH, "sha512")
    .toString("hex");
};

/**
 * returns a new JWT token with encrypted payload
 *
 * @param {any} payload any payload to encrypt
 * @returns new JWT token
 */
exports.pass = (payload) =>
  jwt.sign(payload, process.env.SECRET, {
    expiresIn: "6h",
  });

/**
 *
 * @param {string} token token to check validity
 * @returns {boolean} isValid
 */
exports.checkToken = (token) => jwt.decode(token, process.env.SECRET);
