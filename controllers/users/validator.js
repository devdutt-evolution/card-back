const { ObjectId } = require("mongoose").Types;

exports.handleUserId = (req, res, next, userId) => {
  try {
    req.params.userId = new ObjectId(userId);
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid User Id." });
    return;
  }
};
