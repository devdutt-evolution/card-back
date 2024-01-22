const { getUserTokens } = require("./aggregatePipelines");
const { sendMessage } = require("./firebase");

exports.getTagsFromPost = (post) => {
  const jsdom = require("jsdom");
  const { JSDOM } = jsdom;

  const {
    window: { document },
  } = new JSDOM(post);

  let tags = [];

  const items = document.querySelectorAll("span[data-type=mention]");
  items.forEach((span) => {
    let anchor = document.createElement("a");
    anchor.setAttribute("target", `_blank`);
    let id = span.getAttribute("data-id");
    let username = span.innerHTML;

    anchor.setAttribute("href", `/user/${id}`);
    anchor.textContent = username;
    span.removeChild(span.firstChild);
    span.appendChild(anchor);

    tags.push({
      id,
      username,
    });
  });

  post = document.querySelector("body").innerHTML;
  return [tags, post];
};

exports.getTagsFromComment = (comment) => {
  const findTagsPattern = new RegExp(/@\[([^\]]+)\]\(\w+\)/, "g");

  const matched = comment.match(findTagsPattern);
  let tags;
  if (matched && matched.length > 0) {
    tags = matched.map((str) => {
      let lastNameIndex = str.indexOf("]");
      let username = str.substring(2, lastNameIndex);
      let id = str.substring(lastNameIndex + 2, str.length - 1);
      return { username, id };
    });
  }

  return tags;
};

exports.sendMessages = async (tags, type, username, postId) => {
  const { User } = require("../models/user");

  const title = `Tagged in ${type}`;
  const body = `You have been mentioned in ${type} by ${username}.`;
  const url = `https://card-demo-64li.vercel.app/post/${postId}`;

  const users = await User.aggregate(getUserTokens(tags));

  sendMessage(users, title, body, url);
};
