const webPush = require('web-push');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const subscriptionModel = require('../models/subscription.model');

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.log("You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY "+
    "environment variables. You can use the following ones:");
  console.log(webPush.generateVAPIDKeys());
  return;
}
// Set the keys used for encrypting the push messages.
webPush.setVapidDetails(
  'http://192.168.1.107:3030',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

router.get('/vapidPublicKey', function(req, res) {
  res.send(process.env.VAPID_PUBLIC_KEY);
});

router.post('/register', async (req, res) => {
  await subscriptionModel.add(res.locals.account.id, JSON.stringify(req.body));
  res.sendStatus(200);
});

router.post('/unregister', async (req, res) => {
  await subscriptionModel.delete(res.locals.account.id, JSON.stringify(req.body));
  res.sendStatus(200);
})

module.exports = router;