const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    message: { type: String, required: true },

    readStatus: { type: Boolean, default: false },

    job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },

}, { timestamps: true });

module.exports = mongoose.model("Notification", NotificationSchema);
