const Subscription = require("../models/Subscription");

exports.addSubscription = async (req, res) => {
    const { userId, subscription } = req.body;

    try {
        await Subscription.findOneAndUpdate(
            { userId: userId },
            {
                userId: userId,
                endpoint: subscription.endpoint,
                expirationTime: subscription.expirationTime,
                keys: subscription.keys
            },
            { upsert: true, new: true }
        );
        res.status(201).json({ message: "Subscription saved" });
    } catch (error) {
        console.error("Error saving subscription:", error);
        res.status(500).json({ message: "Failed to save subscription" });
    }
}