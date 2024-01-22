const mongoose = require("mongoose");

module.exports = {
  getPostsPipeline: (userId, option, _page, _limit) => [
    {
      $match: {
        $or: [
          { publishAt: null },
          {
            publishAt: { $gt: Date.now() },
            userId: new mongoose.Types.ObjectId(userId),
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
          $in: [userId, "$likes"],
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
  ],
  getPostPipeline: (postId, userId) => [
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
                $in: [userId, "$likes"],
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
          $in: [userId, "$likes"],
        },
        numberOfLikes: {
          $size: "$likes",
        },
        commentCount: {
          $size: "$comments",
        },
      },
    },
  ],
  getLikes: (postId) => [
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
  ],
  defaultSuggestionPipeline: () => [
    {
      $project: {
        id: "$_id",
        display: "$name",
        _id: 0,
      },
    },
    {
      $limit: 4,
    },
  ],
  getSuggestionPipeline: (rg) => [
    {
      $match: {
        $or: [
          {
            username: {
              $regex: rg,
            },
          },
          {
            name: {
              $regex: rg,
            },
          },
        ],
      },
    },
    {
      $project: {
        id: "$_id",
        display: "$name",
        _id: 0,
      },
    },
  ],
  getUserTokens: (tags) => {
    const ids = tags.map((tag) => new mongoose.Types.ObjectId(tag.id));
    return [
      {
        $match: {
          _id: {
            $in: ids,
          },
        },
      },
      {
        $project: {
          _id: "$token",
        },
      },
      {
        $group: {
          _id: "$_id",
        },
      },
      {
        $project: {
          id: "$_id",
          _id: 0,
        },
      },
    ];
  },
};
