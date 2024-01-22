const { User } = require("../../models/user");
const {
  defaultSuggestionPipeline,
  getSuggestionPipeline,
} = require("../../utils/aggregatePipelines");
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

    const users = await User.aggregate(
      _q ? getSuggestionPipeline(rg) : defaultSuggestionPipeline()
    );

    return res.json({ users });
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
