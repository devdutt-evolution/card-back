const { Post } = require("../../models/post");
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

    // firebase notifications
    if (reaction == REACTIONS.LIKE) {
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
