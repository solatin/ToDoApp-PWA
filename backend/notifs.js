const webPush = require('web-push');
const express = require('express');
const router = express.Router();
const fs = require('fs');

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.log("You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY "+
    "environment variables. You can use the following ones:");
  console.log(webPush.generateVAPIDKeys());
  console.log(process.env.VAPID_PUBLIC_KEY);
  return;
}
// Set the keys used for encrypting the push messages.
webPush.setVapidDetails(
  'http://localhost:3004',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

router.get('/vapidPublicKey', function(req, res) {
  
  res.send(process.env.VAPID_PUBLIC_KEY);
});

router.post('/register', function(req, res) {
  // A real world application would store the subscription info.
  fs.writeFile("./subscription.json", JSON.stringify(req.body, null, 2), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
}); 
  res.sendStatus(201);
});

router.post('/sendNotification', function(req, res) {
  const subscription = req.body.subscription;
  const payload = req.body.payload;
  const options = {
    TTL: req.body.ttl
  };

  setTimeout(function() {
    webPush.sendNotification(subscription, payload, options)
    .then(function() {
      res.sendStatus(201);
    })
    .catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  }, req.body.delay * 1000);
});

module.exports = router;