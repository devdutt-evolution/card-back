const { Post } = require("../../models/post");
const { Report } = require("../../models/reported");
const { REACTIONS } = require("../../utils/consts");
const {
  getTagsFromPost,
  sendMessages,
  sendMessageOnLikePost,
} = require("../../utils/helper");
const {
  getPostsPipeline,
  getPostPipeline,
  getLikes,
  getCountLikesPosts,
} = require("../../utils/aggregatePipelines");
const { default: mongoose } = require("mongoose");

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

exports.getPosts = async (req, res) => {
  try {
    let { _q, _limit, _page, _sort, _order, _userId } = req.query;
    let option = {};

    _q = _q || "";
    _limit = _limit || "10";
    _page = _page || "1";
    _sort = _sort || "createdAt";
    _order = _order || "desc";

    option[_sort] = _order === "asc" ? 1 : -1;

    let aggregatePipe = getPostsPipeline(req.userId, option, _page, _limit);

    if (_q && _q != "") {
      aggregatePipe = [
        {
          $match: {
            $text: { $search: _q },
          },
        },
        ...aggregatePipe,
      ];
      // posts = await Post.aggregate(
      //   _expand == "user" ? aggregatePipe : aggregatePipe.slice(0, 5)
      // );
    } else if (_userId && _userId !== "") {
      aggregatePipe.splice(3, 2);
      aggregatePipe = [
        {
          $match: {
            userId: new mongoose.Types.ObjectId(_userId),
          },
        },
        ...aggregatePipe,
      ];
    }
    let posts = await Post.aggregate(aggregatePipe);

    res.status(200).json({ posts });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.getPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.aggregate(getPostPipeline(postId, req.userId));

    res.json({ post: post[0] });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { title, body } = req.body;

    const [tags, post] = getTagsFromPost(body);

    const postObject = {
      title,
      body: post,
      isEdited: true,
      userId: req.userId,
      taggedUsers: tags,
    };

    const editedPost = await Post.findOneAndUpdate(
      { _id: req.params.postId, userId: req.userId },
      postObject
    );

    if (!editedPost)
      return res.status(404).json({ message: "Could not find the post" });

    res.sendStatus(200);
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

    if (reaction !== REACTIONS.UNLIKE) {
      await Post.updateOne(
        { _id: postId },
        {
          $pull: {
            likes: { userId: req.userId },
          },
        }
      );
      await Post.updateOne(
        { _id: postId },
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
      await Post.updateOne(
        { _id: postId },
        {
          $pull: {
            likes: { userId: req.userId },
          },
        }
      );
    }

    // firebase notifications
    if (reaction !== REACTIONS.UNLIKE) {
      // returns  { likes, token }
      const likes = await Post.aggregate(getCountLikesPosts(postId));
      sendMessageOnLikePost(likes[0], req.username, postId);
    }

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.reportPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    await Report.create({
      postId: req.params.postId,
      userId: req.userId,
      reason: req.body?.reason,
    });

    return res.status(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
