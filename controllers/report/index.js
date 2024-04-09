const { Post } = require("../../models/post");
const { Reported } = require("../../models/reported");
const { sendMessages } = require("../../utils/helper");

exports.reportPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    await Reported.create({
      postId: req.params.postId,
      userId: req.userId,
      reason: req.body?.reason,
    });

    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.getReported = async (req, res) => {
  try {
    res.sendStatus(201);

    // send fcm and save it in DB
    sendMessages(
      tags,
      "reply",
      req.username,
      postId,
      commentId,
      createdReply._id
    );
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

exports.deleteReportedPost = async (req, res) => {
  try {
    res.sendStatus(201);

    // send fcm and save it in DB
    sendMessages(
      tags,
      "reply",
      req.username,
      postId,
      commentId,
      createdReply._id
    );
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

exports.discardReport = async (req, res) => {
  try {
    res.sendStatus(201);

    // send fcm and save it in DB
    sendMessages(
      tags,
      "reply",
      req.username,
      postId,
      commentId,
      createdReply._id
    );
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};
