const jsdom = require("jsdom");
const { JSDOM } = jsdom;

exports.getTagsFromPost = (post) => {
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
