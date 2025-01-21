const mongoose = require('mongoose');

const UserSubscriptionSchema = new mongoose.Schema({
  subscription: {
    type: Object,
    required: true,
  },
});

const UserSubscription = mongoose.model('UserSubscription', UserSubscriptionSchema);
module.exports = UserSubscription;
