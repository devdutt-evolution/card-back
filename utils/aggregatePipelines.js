const mongoose = require('mongoose');

module.exports = {
  /**
   * It returns a aggregatePipeline to fetch posts with pagination from DB
   *
   * @param {string} userId users unique ID
   * @param {Record<string, number>} option object with sort field
   * @param {number} _page page number for pagination
   * @param {number} _limit per page documents
   * @returns aggreagteQuery for fetch posts
   */
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
        deleted: {
          $exists: false,
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
      $project: {
        userId: 1,
        title: 1,
        body: 1,
        publishAt: 1,
        isEdited: { $ifNull: ['$isEdited', false] },
        numberOfLikes: {
          $size: '$likes',
        },
        userLike: {
          $filter: {
            input: '$likes',
            as: 'like',
            cond: {
              $eq: ['$$like.userId', userId],
            },
          },
        },
      },
    },
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'postId',
        as: 'commentCount',
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
          $size: '$commentCount',
        },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
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
        path: '$user',
      },
    },
    {
      $addFields: {
        likedByUser: {
          $gt: [
            {
              $size: '$userLike',
            },
            0,
          ],
        },
      },
    },
    {
      $unwind: {
        path: '$userLike',
        preserveNullAndEmptyArrays: true,
      },
    },
  ],
  /**
   *
   * @param {string} postId post's unique ID
   * @param {string} userId user's unique ID
   * @returns aggregatePipeline to fetch post details
   */
  getPostPipeline: (postId, userId) => [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(postId),
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
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
        path: '$user',
      },
    },
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'postId',
        as: 'comments',
        pipeline: [
          {
            $sort: { createdAt: -1 },
          },
          {
            $project: {
              userId: 1,
              username: 1,
              replies: {
                $size: '$replies',
              },
              body: 1,
              numberOfLikes: {
                $size: '$likes',
              },
              likedByUser: {
                $in: [userId, '$likes.userId'],
              },
              userLike: {
                $filter: {
                  input: '$likes',
                  as: 'like',
                  cond: {
                    $eq: ['$$like.userId', userId],
                  },
                },
              },
            },
          },
          {
            $unwind: {
              path: '$userLike',
              preserveNullAndEmptyArrays: true,
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
        isEdited: { $ifNull: ['$isEdited', false] },
        comments: 1,
        likedByUser: {
          $in: [userId, '$likes.userId'],
        },
        numberOfLikes: {
          $size: '$likes',
        },
        commentCount: {
          $size: '$comments',
        },
        userLike: {
          $filter: {
            input: '$likes',
            as: 'like',
            cond: {
              $eq: ['$$like.userId', userId],
            },
          },
        },
      },
    },
    {
      $unwind: {
        path: '$userLike',
        preserveNullAndEmptyArrays: true,
      },
    },
  ],
  /**
   * get likes for perticular post with user's details who has liked the post
   *
   * @param {string} postId post's unique ID
   * @returns aggregatePipeline to get likes
   */
  getLikes: (postId) => [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(postId),
      },
    },
    {
      $project: {
        user: '$likes',
      },
    },
    {
      $unwind: {
        path: '$user',
      },
    },
    {
      $addFields: {
        userId: {
          $toObjectId: '$user',
        },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
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
        path: '$user',
      },
    },
    {
      $project: {
        _id: '$user._id',
        name: '$user.username',
        email: '$user.email',
      },
    },
  ],
  /**
   * To get the default first four users while hitting the default '@' while mentioning
   *
   * @returns aggregatePipeline to get Users
   */
  defaultSuggestionPipeline: () => [
    {
      $project: {
        id: '$_id',
        display: '$name',
        picture: '$picture',
        _id: 0,
      },
    },
    {
      $limit: 4,
    },
  ],
  /**
   * It returns the users whose username or displayName mathches the provided regex expression
   *
   * @param {RegExp} rg
   * @returns aggregatePipeline to fetch users
   */
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
        id: '$_id',
        display: '$name',
        picture: '$picture',
        _id: 0,
      },
    },
  ],
  /**
   * It returns the tagged user's unique Id and fcmToken
   *
   * @param {Array<{ id: string, token: string }>} tags
   * @returns aggregatePipeline to get Tagged users
   */
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
          _id: '$token',
        },
      },
      {
        $group: {
          _id: '$_id',
        },
      },
      {
        $project: {
          id: '$_id',
          _id: 0,
        },
      },
    ];
  },
  /**
   * to get user's token who needs to get notified and count likes on post
   *
   * @param {string} postId post's unique ID which is liked
   * @returns aggregatePipeline to return `{ token, userId, likes }`
   */
  getCountLikesPosts: (postId) => [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(postId),
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
        pipeline: [
          {
            $project: {
              token: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: '$user',
      },
    },
    {
      $project: {
        likes: {
          $size: '$likes',
        },
        token: '$user.token',
        userId: '$user._id',
        _id: 0,
      },
    },
  ],
  /**
   * to get user's token who needs to get notified and count likes on comment
   *
   * @param {string} commentId comment's unique ID which is liked
   * @returns aggregatePipe to fetch `{token, userId, token, postId}`
   */
  getCountLikesComments: (commentId) => [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(commentId),
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
        pipeline: [
          {
            $project: {
              token: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: '$user',
      },
    },
    {
      $project: {
        likes: {
          $size: '$likes',
        },
        postId: '$postId',
        token: '$user.token',
        userId: '$user._id',
        _id: 0,
      },
    },
  ],
  /**
   * get users details with his/her's 3 recent posts
   * @param {string} userId user of to get details of
   * @returns aggregate pipeline
   */
  getUsersWithRecentPosts: (userId, searchUserId) => [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: 'userId',
        as: 'posts',
        pipeline: [
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $limit: 3,
          },
          {
            $project: {
              createdAt: 0,
              updatedAt: 0,
              userId: 0,
              taggedUsers: 0,
            },
          },
          {
            $lookup: {
              from: 'comments',
              localField: '_id',
              foreignField: 'postId',
              as: 'comments',
            },
          },
          {
            $addFields: {
              userLike: {
                $filter: {
                  input: '$likes',
                  as: 'like',
                  cond: {
                    $eq: ['$$like.userId', searchUserId],
                  },
                },
              },
              likes: {
                $size: '$likes',
              },
              comments: {
                $size: '$comments',
              },
            },
          },
          {
            $unwind: {
              path: '$userLike',
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
      },
    },
    {
      $project: {
        createdAt: 0,
        updatedAt: 0,
        token: 0,
        hash: 0,
      },
    },
  ],
  /**
   * Get reported posts recently reported first
   * @returns getReportPipeline
   */
  getReportedPosts: (userId) => [
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
        pipeline: [
          {
            $project: {
              username: 1,
              name: 1,
              picture: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $group: {
        _id: '$postId',
        reports: {
          $push: {
            reason: '$reason',
            userId: '$userId',
            user: '$user',
          },
        },
        reportedCount: {
          $count: {},
        },
      },
    },
    {
      $sort: {
        reportedCount: -1,
      },
    },
    {
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: '_id',
        as: 'post',
        pipeline: [
          {
            $project: {
              userId: 1,
              title: 1,
              body: 1,
              publishAt: 1,
              isEdited: {
                $ifNull: ['$isEdited', false],
              },
              numberOfLikes: {
                $size: '$likes',
              },
              userLike: {
                $filter: {
                  input: '$likes',
                  as: 'like',
                  cond: {
                    $eq: ['$$like.userId', userId],
                  },
                },
              },
            },
          },
          {
            $lookup: {
              from: 'comments',
              localField: '_id',
              foreignField: 'postId',
              as: 'commentCount',
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
                $size: '$commentCount',
              },
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user',
              pipeline: [
                {
                  $project: {
                    username: 1,
                    name: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: '$user',
            },
          },
          {
            $addFields: {
              likedByUser: {
                $gt: [
                  {
                    $size: '$userLike',
                  },
                  0,
                ],
              },
            },
          },
          {
            $unwind: {
              path: '$userLike',
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: '$post',
        preserveNullAndEmptyArrays: false,
      },
    },
  ],
};
