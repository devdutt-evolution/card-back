const { default: mongoose } = require("mongoose");
const { Post } = require("../../models/post");
const { body, validationResult } = require("express-validator");

exports.validatePostBody = (req, res, next) => {
  body("title").notEmpty().isString().withMessage("title is required");
  body("body")
    .notEmpty()
    .isString()
    .isLength(15)
    .withMessage("body is required");

  const result = validationResult(req);
  if (result.isEmpty()) return next();

  res.send(400).json({ errors: result.array() });
};

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

exports.getPosts = async (req, res) => {
  try {
    const {
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
        $project: {
          userId: 1,
          user: 1,
          title: 1,
          body: 1,
        },
      },
    ];

    let posts = await Post.aggregate(
      _expand == "user" ? aggregatePipe : aggregatePipe.slice(0, 3)
    );

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

exports.getPostHealth = async (req, res) => {
  try {
    let post = await Post.findOne().lean();

    res.json({ post });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
