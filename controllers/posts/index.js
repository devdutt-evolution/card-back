const { default: mongoose } = require("mongoose");
const { Post } = require("../../models/post");
const { Comment } = require("../../models/comment");

exports.createPost = async (req, res) => {
  try {
    const { title, body } = req.body;

    await Post.create({ title, body, userId: "65968c17bb2bf29e42fbd3c4" });

    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

exports.createComment = async (req, res) => {
  try {
    const { name, email, body } = req.body;
    const { postId } = req.params;

    let post = await Post.countDocuments({ _id: postId });

    if (post == 0)
      return res.status(404).json({ message: "No such post found" });

    await Comment.create({ name, email, body, postId });

    res.sendStatus(201);
  } catch (err) {
    console.error(err);
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
        $sort: option,
      },
      {
        $skip: (parseInt(_page) - 1) * parseInt(_limit),
      },
      {
        $limit: parseInt(_limit),
      },
      {
        $project: {
          userId: 1,
          title: 1,
          body: 1,
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
        _expand == "user" ? aggregatePipe : aggregatePipe.slice(0, 4)
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
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
              },
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
