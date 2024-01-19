const admin = require("firebase-admin");
const path = require("node:path");

const serviceAccount = require(path.resolve(__dirname, "../firebase.json"));

const adminApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.sendMessage = async (
  toToken = [
    {
      id: "dkFHrp2GImv4FWhRW3exFx:APA91bHmR1TMOulZdUM0ogupzpKbSzLGdlM2GTZAqNx10Z1gQvAX4Hf7zjg-OUhg5ZBvrVgh4j-Eb5-8G9ldI1YW6wW54HU2efNB2zzoFnxtIocFCSszvZPpziIUTu9infQZMt0xAYI8",
    },
  ],
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
