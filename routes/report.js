const router = require("express").Router();
const { checkAuth, checkAdmin } = require("../controllers/auth");
const reportController = require("../controllers/report");

// report
router.post("/:postId", checkAuth, reportController.reportPost);
router.get("/", checkAuth, checkAdmin, reportController.getReported);
router.delete(
  "/:postId",
  checkAuth,
  checkAdmin,
  reportController.deleteReportedPost
);
router.put("/:postId", checkAuth, checkAdmin, reportController.discardReport);

module.exports = router;
