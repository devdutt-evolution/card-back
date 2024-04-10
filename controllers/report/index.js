const { Post } = require('../../models/post');
const { Reported } = require('../../models/reported');
const { getReportedPosts } = require('../../utils/aggregatePipelines');

exports.reportPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    await Reported.create({
      postId: req.params.postId,
      userId: req.userId,
      reason: req.body?.reason,
    });

    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.getReported = async (req, res) => {
  try {
    const posts = await Reported.aggregate(getReportedPosts(req.userId));

    res.status(200).json({ posts });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

exports.deleteReportedPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByIdAndUpdate(postId, {
      deleted: true,
    });

    if (!post) return res.status(404).json({ message: 'No such post found' });
    // remove reports of that specific postId
    Reported.deleteMany({ postId }).then().catch();

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

exports.discardReport = async (req, res) => {
  try {
    const { postId } = req.params;

    await Reported.deleteMany({ postId });

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};
