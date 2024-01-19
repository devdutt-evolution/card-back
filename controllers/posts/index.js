const { default: mongoose } = require("mongoose");
const { Post } = require("../../models/post");
const { Comment } = require("../../models/comment");
const { REACTIONS } = require("../../utils/consts");
const {
  getTagsFromComment,
  getTagsFromPost,
  sendMessages,
} = require("../../utils/helper");
// const { sendMessages } = require("../../utils/firebase");

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

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.getPosts = async (req, res) => {
  try {
    const {
      _q = "",
      _limit = "10",
      _page = "1",
      _sort = "title",
      _order = "asc",
      _expand,
    } = req.query;
    let option = {};
    option[_sort] = _order == "asc" ? 1 : -1;

    let aggregatePipe = [
      {
        $match: {
          $or: [
            { publishAt: null },
            {
              publishAt: { $gt: Date.now() },
              userId: new mongoose.Types.ObjectId(req.userId),
            },
          ],
        },
      },
      {
        $project: {
          userId: 1,
          title: 1,
          body: 1,
          publishAt: 1,
          numberOfLikes: {
            $size: "$likes",
          },
          likedByUser: {
            $in: [req.userId, "$likes"],
          },
        },
      },
      {
        $sort: option,
      },
      {
        $skip: (parseInt(_page) - 1) * parseInt(_limit),
      },
      {
        $limit: parseInt(_limit),
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "commentCount",
          pipeline: [
            {
              $project: {
                _id: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          commentCount: {
            $size: "$commentCount",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $project: {
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$user",
        },
      },
    ];
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

    let aggregatePipe = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(postId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $project: {
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$user",
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "comments",
          pipeline: [
            {
              $project: {
                name: 1,
                email: 1,
                body: 1,
                numberOfLikes: {
                  $size: "$likes",
                },
                likedByUser: {
                  $in: [req.userId, "$likes"],
                },
              },
            },
            {
              $sort: { numberOfLikes: -1 },
            },
          ],
        },
      },
      {
        $project: {
          userId: 1,
          user: 1,
          title: 1,
          body: 1,
          comments: 1,
          likedByUser: {
            $in: [req.userId, "$likes"],
          },
          numberOfLikes: {
            $size: "$likes",
          },
          commentCount: {
            $size: "$comments",
          },
        },
      },
    ];

    let post = await Post.aggregate(aggregatePipe);

    res.json({ post: post[0] });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.getLikes = async (req, res) => {
  const { postId } = req.params;

  let likePipe = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(postId),
      },
    },
    {
      $project: {
        user: "$likes",
      },
    },
    {
      $unwind: {
        path: "$user",
      },
    },
    {
      $addFields: {
        userId: {
          $toObjectId: "$user",
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              email: 1,
              username: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$user",
      },
    },
    {
      $project: {
        _id: "$user._id",
        name: "$user.username",
        email: "$user.email",
      },
    },
  ];

  let likes = await Post.aggregate(likePipe);

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

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
