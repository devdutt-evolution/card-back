const { Post } = require("./models/post");

const a = async () => {
  const posts = await Post.find({}, { _id: 1 }).lean();
  let queries = [];
  let createcomm = [];
  for (let i = 1; i < 101; i++) {
    queries.push(
      new Promise((res, rej) => {
        return fetch(`https://jsonplaceholder.typicode.com/posts/${i}/comments`)
          .then((data) => data.json())
          .then((data) => res(data));
      })
    );
  }

  let result = await Promise.all(queries);

  result.map((comms, index) => {
    comms.map((m) => {
      delete m["id"];
      m["postId"] = posts[index]._id;
      createcomm.push(m);
    });
  });

  return createcomm;
};

module.exports = { a };
