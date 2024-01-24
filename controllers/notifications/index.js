const { Notification } = require("../../models/notification");

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.userId;

    const notifications = await Notification.find(
      {
        userId,
        seen: false,
      },
      { createdAt: 0, updatedAt: 0, userId: 0 }
    )
      .sort({ createdAt: -1 })
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
