const cron = require("node-cron");
const { Post } = require("./models/post");

cron.schedule("1 * * * *", async () => {
  console.log("started Cron");
  let updated = await Post.updateMany(
    {
      publishAt: { $lte: Date.now() },
    },
    { $unset: { publishAt: "" } }
  );

  console.log("updated", updated.modifiedCount);
});
