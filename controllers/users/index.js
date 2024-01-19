const { User } = require("../../models/user");
const { hashIt, pass } = require("../../utils/secure");

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

exports.getUsers = async (req, res) => {
  try {
    const { _q } = req.query;
    let rg = new RegExp(`${_q}`, ["i"]);

    if (_q) {
      const users = await User.aggregate([
        {
          $match: {
            $or: [
              {
                username: {
                  $regex: rg,
                },
              },
              {
                name: {
                  $regex: rg,
                },
              },
            ],
          },
        },
        {
          $project: {
            id: "$_id",
            display: "$name",
            _id: 0,
          },
        },
      ]);

      return res.json({ users });
    } else {
      const users = await User.aggregate([
        {
          $project: {
            id: "$_id",
            display: "$name",
            _id: 0,
          },
        },
        {
          $limit: 4,
        },
      ]);

      return res.json({ users });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    await User.create({ username, email, hash: hashIt(password) });

    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, fcmToken } = req.body;

    let user = await User.findOne({ email }, { hash: 1, username: 1 });

    if (hashIt(password) == user.hash) {
      res.status(200).json({
        token: pass({
          _id: user._id,
          email,
          username: user.username,
        }),
        id: user._id,
        name: user.username,
        email: email,
      });
    } else {
      res.status(401).json({ message: "email and password does not match" });
    }

    user.token = fcmToken;
    await user.save();
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};
