const { checkToken } = require("../../utils/secure");

exports.checkAuth = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(" ")[1];
      if (token) {
        let payload = checkToken(token);

        req.userId = payload._id;
        req.email = payload.email;
        req.username = payload.username;
        req.admin = payload.admin;
        return next();
      }
      return res.status(401).json({ message: "Not Authorized" });
    } else res.status(401).json({ message: "No Auth Header Found" });
  } catch (err) {
    res.status(401).json({ message: "Not Authorized" });
  }
};

exports.checkAdmin = (req, res, next) => {
  if (req.admin) next();
  else {
    return res.status(403).json({ message: "Not Authorized" });
  }
};
