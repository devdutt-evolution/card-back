const router = require("express").Router();
const { checkAuth } = require("../controllers/auth");
const notificationHandler = require("../controllers/notifications");

// notification
router.get("/", checkAuth, notificationHandler.getNotifications);
router.put("/", checkAuth, notificationHandler.markNotificationSeen);

module.exports = router;
