const { User } = require("../../models/user");

exports.getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne(
      { _id: userId },
      { createdAt: 0, updatedAt: 0, __v: 0 }
    ).lean();

    res.json({ user });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
