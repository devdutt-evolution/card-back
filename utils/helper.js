const { JSDOM } = require("jsdom");
const { getUserTokens } = require("./aggregatePipelines");
const { sendMessage } = require("./firebase");
const { User } = require("../models/user");
const { Notification } = require("../models/notification");

/**
 * @typedef {({id: string, token: string})} Tag
 * @typedef {([Array<Tag>, string])} TagsFromPost
 */

/**
 * updates the postBody with a link to users profile and returns it and tagged users
 *
 * @param {string} postBody string of HTML received while creating a post
 * @returns {TagsFromPost} tags and postBody to save
 */
exports.getTagsFromPost = (postBody) => {
  const {
    window: { document },
  } = new JSDOM(postBody);

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

  postBody = document.querySelector("body").innerHTML;
  return [tags, postBody];
};

/**
 * returns tagged users from comment
 *
 * @param {string} commentBody commentBody to extract tags from
 * @returns {Array<Tag>} tagged users in comment
 */
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

/**
 * sends messages to the tagged users
 *
 * @param {Array<Tag>} tags tagged users
 * @param {string} type tagged in comment of post
 * @param {string} username username of user who tagged
 * @param {string} postId post's unique ID in which user is tagged
 * @param {?string} commentId comment's unique ID if tagged in comment
 * @returns void
 */
exports.sendMessages = async (tags, type, username, postId, commentId) => {
  if (!tags || tags.length == 0) return;

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

/**
 * sends messages to the user whose post is liked
 *
 * @param {({likes: number, token: string, userId: string})} likeObject object returned from DB
 * @param {string} username user who liked
 * @param {string} postId post which is liked
 */
exports.sendMessageOnLikePost = async (likeObject, username, postId) => {
  const { likes, token, userId } = likeObject;

  const title = `${username} liked your post`;
  const body =
    likes > 1
      ? `${username} & ${likes - 1} others liked your post.`
      : likes == 1
      ? `${username} liked your post`
      : ".";
  const url = `/post/${postId}`;

  await Notification.create({ userId, title, description: body, url });

  sendMessage([{ id: token }], title, body, url);
};

/**
 * sends message to the comment creator
 *
 * @param {({likes: number, token: string, postId: string, userId: string})} likeObject
 * @param {string} username user who liked
 * @param {string} commentId comment which is liked
 */
exports.sendMessageOnLikeComment = async (likeObject, username, commentId) => {
  const { likes, token, postId, userId } = likeObject;

  const title = `${username} liked your comment`;
  const body =
    likes > 1
      ? `${username} & ${likes - 1} others liked your comment.`
      : likes == 1
      ? `${username} liked your comment`
      : ".";
  const url = `/post/${postId}#${commentId}`;

  await Notification.create({ userId, title, description: body, url });

  sendMessage([{ id: token }], title, body, url);
};
