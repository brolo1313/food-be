const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const webpush = require("web-push");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 4000;

const dummyDb = { subscription: null }; //dummy in memory store

const saveToDatabase = async (subscription) => {
  // Since this is a demo app, I am going to save this in a dummy in memory store. Do not do this in your apps.
  // Here you should be writing your db logic to save it.
  dummyDb.subscription = subscription;
};

// The new /save-subscription endpoint
app.post("/save-subscription", async (req, res) => {
  try {
    const subscription = req.body;
    // Assuming saveToDatabase returns a Promise or is an async operation
    await saveToDatabase(subscription);
    res.json({ message: "Subscription saved successfully" });

    const welcomeMessage = {
      body: "Welcome to our service!",
      title: "Welcome Notification",
    };
    sendNotification(subscription, JSON.stringify(welcomeMessage));
  } catch (error) {
    console.error("Error saving subscription:", error);
    res.status(500).json({ error: "Failed to save subscription" });
  }
});

const vapidKeys = {
  publicKey:
    "BCLziGMSO3gEVA6tus4p50DJPMtvVfOzUlEMhDx3zocpy31XOH0kpXj1HVG-HnpakoKHqJJYr2jM7z6Uxdq9gMY",
  privateKey: "4SwjItU4M7lPqr9_WGltD_ugojG56XadTUGUE3E0yfw",
};

//setting our previously generated VAPID keys
webpush.setVapidDetails(
  "mailto:myuserid@email.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

//function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend) => {
  webpush.sendNotification(subscription, dataToSend);
};

app.get('/', (req, res) => {
  res.status(200).json('Welcome, your server-app is working well');
})

//route to test send notification
app.get("/send-notification", (req, res) => {
  const subscription = dummyDb.subscription; //get subscription from your databse here.

  console.log(subscription);
  const message = {
    body: "from server",
    title: "Server send title",
  };

  console.log("client subscription", subscription);

  sendNotification(subscription, JSON.stringify(message));
  res.json({ message: "message sent" });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


module.exports = app