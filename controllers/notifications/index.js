const { Notification } = require("../../models/notification");

exports.getNotifications = async (req, res) => {
  try {
    let { _page, _limit } = req.query;
    const userId = req.userId;

    if (!_page) _page = 1;
    else _page = parseInt(_page);
    if (!_limit) _limit = 10;
    else _limit = parseInt(_limit);

    const notifications = await Notification.find(
      { userId },
      { createdAt: 0, updatedAt: 0, userId: 0 }
    )
      .sort({ createdAt: -1 })
      .skip((_page - 1) * _limit)
      .limit(_limit)
      .lean();

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
