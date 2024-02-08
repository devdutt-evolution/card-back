const { Comment } = require("../../../models/comment");
const { Post } = require("../../../models/post");
const {
  getTagsFromComment,
  sendMessageOnLikeComment,
  sendMessages,
} = require("../../../utils/helper");
const { getCountLikesComments } = require("../../../utils/aggregatePipelines");
const { REACTIONS } = require("../../../utils/consts");

exports.createComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const { postId } = req.params;

    let post = await Post.countDocuments({ _id: postId });

    if (post == 0)
      return res.status(404).json({ message: "No such post found" });

    const tags = getTagsFromComment(comment) || [];

    const createdComment = await Comment.create({
      username: req.username,
      body: comment,
      taggedUsers: tags,
      postId,
      userId: req.userId,
    });

    res.sendStatus(201);

    // send fcm and save it in DB
    sendMessages(tags, "comment", req.username, postId, createdComment._id);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

exports.reactComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { reaction } = req.body;

    if (reaction !== REACTIONS.UNLIKE) {
      await Comment.updateOne(
        { _id: commentId },
        {
          $pull: {
            likes: { userId: req.userId },
          },
        }
      );
      await Comment.updateOne(
        { _id: commentId },
        {
          $addToSet: {
            likes: {
              userId: req.userId,
              reactionType: reaction,
            },
          },
        }
      );
    } else {
      await Comment.updateOne(
        { _id: commentId },
        {
          $pull: {
            likes: { userId: req.userId },
          },
        }
      );
    }

    if (reaction !== REACTIONS.UNLIKE) {
      const likes = await Comment.aggregate(getCountLikesComments(commentId));
      sendMessageOnLikeComment(likes[0], req.username, commentId);
    }

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
