const router = require("express").Router();
const { checkAuth } = require("../controllers/auth");
const {
  getNotifications,
  markNotificationSeen,
} = require("../controllers/notifications");

// notification
router.get("/", checkAuth, getNotifications);
router.put("/", checkAuth, markNotificationSeen);

module.exports = router;
