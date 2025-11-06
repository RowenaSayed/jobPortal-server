const Notification = require("../models/Notification");

// ================== CREATE NOTIFICATION ==================
exports.createNotification = async (req, res) => {
    try {
        const { user, message, notificationType } = req.body;

        if (!user || !message) {
            return res.status(400).json({ error: "User and message are required" });
        }

        const notification = await Notification.create({
            user,
            message,
            notificationType
        });

        res.status(201).json({ message: "Notification created successfully", notification });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================== GET MY NOTIFICATIONS ==================
exports.getMyNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        const notifications = await Notification.find({ user: userId })
            .sort({ createdAt: -1 });

        res.status(200).json({ notifications });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================== MARK AS READ ==================
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, user: userId },
            { readStatus: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        res.status(200).json({ message: "Notification marked as read", notification });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================== MARK ALL AS READ ==================
exports.markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;

        await Notification.updateMany(
            { user: userId, readStatus: false },
            { $set: { readStatus: true } }
        );

        res.status(200).json({ message: "All notifications marked as read" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================== DELETE A NOTIFICATION ==================
exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const deleted = await Notification.findOneAndDelete({ _id: id, user: userId });

        if (!deleted) {
            return res.status(404).json({ error: "Notification not found" });
        }

        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================== ADMIN GET ALL NOTIFICATIONS ==================
exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find()
            .populate("user", "name email role")
            .sort({ createdAt: -1 });

        res.status(200).json({ notifications });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
