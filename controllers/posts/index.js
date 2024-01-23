const { Post } = require("../../models/post");
const { Comment } = require("../../models/comment");
const { REACTIONS } = require("../../utils/consts");
const {
  getTagsFromComment,
  getTagsFromPost,
  sendMessages,
} = require("../../utils/helper");
const {
  getPostsPipeline,
  getPostPipeline,
  getLikes,
} = require("../../utils/aggregatePipelines");
const { Notification } = require("../../models/notification");

exports.createPost = async (req, res) => {
  try {
    const { title, body, tobePublished, publishAt } = req.body;

    const [tags, post] = getTagsFromPost(body);

    const postObject = {
      title,
      body: post,
      userId: req.userId,
      taggedUsers: tags,
    };

    if (tobePublished) Object.assign(postObject, { publishAt });

    const createdPost = await Post.create(postObject);

    res.sendStatus(201);

    // send fcm and save it in DB
    sendMessages(tags, "post", req.username, createdPost._id);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

exports.createComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const { postId } = req.params;

    let post = await Post.countDocuments({ _id: postId });

    if (post == 0)
      return res.status(404).json({ message: "No such post found" });

    const tags = getTagsFromComment(comment) || [];

    await Comment.create({
      name: req.username,
      email: req.email,
      body: comment,
      taggedUsers: tags,
      postId,
    });

    res.sendStatus(201);

    // send fcm and save it in DB
    sendMessages(tags, "comment", req.username, postId);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

exports.reactComment = async (req, res) => {
  try {
    const { reaction } = req.body;
    const { commentId } = req.params;

    if (reaction == REACTIONS.LIKE) {
      await Comment.updateOne(
        { _id: commentId },
        {
          $addToSet: {
            likes: req.userId,
          },
        }
      );
    } else if (reaction == REACTIONS.UNLIKE) {
      await Comment.updateOne(
        { _id: commentId },
        {
          $pull: {
            likes: req.userId,
          },
        }
      );
    } else return res.status(400).json({ message: "can only like or unlike" });

    // const likes = await Comment.aggregate([
    //   {
    //     $match: {
    //       _id: new mongoose.Types.ObjectId(commentId),
    //     },
    //   },
    //   {
    //     $project: {
    //       likes: { $size: "$likes" },
    //       _id: 0,
    //     },
    //   },
    // ]);

    // res.status(200).json({ likes: likes[0].likes });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.getPosts = async (req, res) => {
  try {
    let { _q, _limit, _page, _sort, _order, _expand } = req.query;
    let option = {};

    _q = _q || "";
    _limit = _limit || "10";
    _page = _page || "1";
    _sort = _sort || "title";
    _order = _order || "asc";

    option[_sort] = _order == "asc" ? 1 : -1;

    let aggregatePipe = getPostsPipeline(req.userId, option, _page, _limit);

    let posts;
    if (_q != "") {
      aggregatePipe = [
        {
          $match: {
            $text: { $search: _q },
          },
        },
        ...aggregatePipe,
      ];
      posts = await Post.aggregate(
        _expand == "user" ? aggregatePipe : aggregatePipe.slice(0, 5)
      );
    } else {
      posts = await Post.aggregate(
        _expand == "user" ? aggregatePipe : aggregatePipe.slice(0, 5)
      );
    }

    res.status(200).json({ posts });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.getPost = async (req, res) => {
  try {
    const { postId } = req.params;

    let post = await Post.aggregate(getPostPipeline(postId, req.userId));

    res.json({ post: post[0] });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.getLikes = async (req, res) => {
  const { postId } = req.params;

  const likes = await Post.aggregate(getLikes(postId));

  res.json({ users: likes });
};

exports.reactPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { reaction } = req.body;

    if (reaction == REACTIONS.LIKE) {
      await Post.updateOne(
        { _id: postId },
        { $addToSet: { likes: req.userId } }
      );
    } else if (reaction == REACTIONS.UNLIKE) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: req.userId } });
    } else {
      return res.status(400).json({ message: "can only like or unlike" });
    }

    // const likes = await Post.aggregate([
    //   {
    //     $match: {
    //       _id: new mongoose.Types.ObjectId(postId),
    //     },
    //   },
    //   {
    //     $project: {
    //       likes: { $size: "$likes" },
    //       _id: 0,
    //     },
    //   },
    // ]);

    // res.status(200).json({ likes: likes[0].likes });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.userId;

    const notifications = await Notification.find(
      {
        userId,
        seen: false,
      },
      { createdAt: 0, updatedAt: 0, userId: 0 }
    ).lean();

    res.status(200).json({ notifications });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.markNotificationSeen = async (req, res) => {
  try {
    const userId = req.userId;

    await Notification.updateMany(
      {
        userId,
        seen: false,
      },
      { $set: { seen: true } }
    );

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
