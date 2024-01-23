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

exports.sendMessages = async (tags, type, username, postId, commentId) => {
  if (!tags || tags.length == 0) return;
  const { getUserTokens } = require("./aggregatePipelines");
  const { sendMessage } = require("./firebase");
  const { User } = require("../models/user");
  const { Notification } = require("../models/notification");

  const title = `Tagged in ${type}`;
  const body = `You have been mentioned in ${type} by ${username}.`;
  let url = !commentId
    ? `${process.env.FRONT_END}/post/${postId}`
    : `${process.env.FRONT_END}/post/${postId}#${commentId}`;

  // saving notifications
  const payload = tags.map((tagObj) => {
    return {
      userId: tagObj.id,
      title,
      description: body,
      url: !commentId ? `/post/${postId}` : `/post/${postId}#${commentId}`,
    };
  });

  const users = await User.aggregate(getUserTokens(tags));
  // saved notifications
  await Notification.create(payload);
  // sending via firebase
  sendMessage(users, title, body, url);
};
