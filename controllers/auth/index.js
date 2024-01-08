const { checkToken } = require("../../utils/secure");

exports.checkAuth = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(" ")[1];
      if (token && checkToken(token)) {
        req.userId = token._id;
        return next();
      }
      return res.status(401).json({ message: "Not Authorized" });
    } else res.status(401).json({ message: "No Auth Header Found" });
  } catch (err) {
    res.status(401).json({ message: "Not Authorized" });
  }
};
