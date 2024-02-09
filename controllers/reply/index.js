const { Reply } = require("../../models/reply");
const { getTagsFromComment, sendMessages } = require("../../utils/helper");

exports.createReply = async (req, res) => {
  try {
    const { comment, postId } = req.body;
    const { commentId } = req.params;

    const tags = getTagsFromComment(comment) || [];

    const createdComment = await Reply.create({
      postId,
      commentId,
      userId: req.userId,
      username: req.username,
      body: comment,
      taggedUsers: tags,
    });

    res.sendStatus(201);

    // send fcm and save it in DB
    sendMessages(tags, "comment", req.username, postId, createdComment._id);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

exports.getReplies = async (req, res) => {
  try {
    const { commentId } = req.params;

    const replies = await Reply.find(
      { commentId },
      { createdAt: 0, updatedAt: 0 }
    )
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ replies });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};
