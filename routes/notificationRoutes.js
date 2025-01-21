const express = require('express');
const webPush = require('web-push');
const router = express.Router();
const UserSubscription = require('../model/UserSubscription'); // MongoDB model to store subscriptions

// Load VAPID keys from environment variables
const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
webPush.setVapidDetails('mailto:example@domain.com', publicKey, privateKey);

// Endpoint to subscribe user to push notifications
router.post('/subscribe', async (req, res) => {
  const subscription = req.body.subscription;
  
  // Save the subscription to the database
  const newSubscription = new UserSubscription({
    subscription: subscription,
  });

  try {
    await newSubscription.save();
    res.status(200).json({ message: 'Subscription successful' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving subscription', error: err });
  }
});

// Send a push notification (e.g., a welcome message)
router.post('/send', async (req, res) => {
  try {
    // Fetch all saved subscriptions from the database
    const subscriptions = await UserSubscription.find();

    const payload = JSON.stringify({
      title: 'Welcome to Dealt!',
      message: 'Thank you for enabling notifications. Stay tuned for updates!',
    });

    // Send the notification to all users who have subscribed
    const sendNotificationPromises = subscriptions.map((sub) => 
      webPush.sendNotification(sub.subscription, payload)
    );

    await Promise.all(sendNotificationPromises);
    res.status(200).json({ message: 'Notifications sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending notifications', error: err });
  }
});

module.exports = router;
