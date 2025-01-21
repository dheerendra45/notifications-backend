const Notification = require('../models/Notification');

// Fetch all notifications for a user
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.params.userId });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new notification
exports.createNotification = async (req, res) => {
    try {
        const { userId, title, message } = req.body;
        const notification = new Notification({ userId, title, message });
        await notification.save();
        res.status(201).json({ message: 'Notification created successfully', notification });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const updatedNotification = await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
        res.status(200).json(updatedNotification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
