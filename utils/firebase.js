const admin = require("firebase-admin");
const path = require("node:path");

const serviceAccount = require(path.resolve(__dirname, "../firebase.json"));

const adminApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/**
 * sends fcm messages to users
 *
 * @param {Array<string>} toToken array of tokens to send fcm to
 * @param {string} title title of the notification
 * @param {string} body body/details of the notification
 * @param {string} url URI to get redirected to on click of notification
 * @returns void
 */
exports.sendMessage = async (
  toToken = [],
  title = "default title",
  body = "default body",
  url = "https://card-demo-64li.vercel.app/posts"
) => {
  if (toToken.length == 0 || !title || !body || !url) return;

  const messaging = adminApp.messaging();

  let payload = {
    data: {
      title,
      body,
    },
    notification: {
      title,
      body,
      // imageUrl: "https://card-demo-64li.vercel.app/logo.svg",
    },
    webpush: {
      fcmOptions: {
        link: url,
      },
      notification: {
        title,
        icon: "https://card-demo-64li.vercel.app/logo.svg",
        actions: [
          {
            action: url,
            title: "Checkout",
          },
          {
            action: "",
            title: "Close",
          },
        ],
      },
    },
  };

  const messageTo = toToken.map((token) => {
    Object.assign(payload, { token: token.id });
    return payload;
  });

  messaging
    .sendEach(messageTo, false)
    .then((v) =>
      console.log(
        "successCount: ",
        v.successCount,
        "failureCount: ",
        v.failureCount
      )
    )
    .catch((e) => console.log("fcm failed", e));
};
