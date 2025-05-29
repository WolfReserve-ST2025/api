const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  endpoint: {
    type: String,
    required: true
  },
  expirationTime: {
    type: Number,
    default: null
  },
  keys: {
    p256dh: {
      type: String,
      required: true
    },
    auth: {
      type: String,
      required: true
    }
  }
});

module.exports = mongoose.model("Subscription", subscriptionSchema);