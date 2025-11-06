const mongoose = require("mongoose");
const NotificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    readStatus: { type: Boolean, default: false },
    notificationType: { type: String }
}, { timestamps: true });   
const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;
