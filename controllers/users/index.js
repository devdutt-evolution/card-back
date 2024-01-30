const { User } = require("../../models/user");
const {
  defaultSuggestionPipeline,
  getSuggestionPipeline,
  getUsersWithRecentPosts,
} = require("../../utils/aggregatePipelines");
const { hashIt, pass } = require("../../utils/secure");

exports.getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.aggregate(
      getUsersWithRecentPosts(userId, req.userId)
    );
    if (user.length == 0) return res.sendStatus(404);

    res.json({ user: user[0] });
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

exports.editProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const { userId } = req.params;

    // if user does not owe the account
    if (userId.toString() !== req.userId)
      return res
        .status(403)
        .json({ message: "You can only edit your profile" });

    const payload = { name, phone };

    if (req?.file) Object.assign(payload, { picture: req.file?.filename });

    await User.updateOne({ _id: userId }, payload);

    res.sendStatus(200);
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

    const user = await User.findOne(
      { email },
      { hash: 1, username: 1, picture: 1 }
    );

    if (hashIt(password) == user.hash) {
      const token = pass({
        _id: user._id,
        email,
        username: user.username,
      });

      const authData = {
        id: user._id,
        email,
        name: user.username,
        picture: user.picture,
        token,
      };

      res.status(200).json(authData);
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
