const { validationResult } = require("express-validator");

exports.validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  res.status(400).json({ message: result.array()[0].msg });
};
