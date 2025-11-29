const mongoose = require("mongoose");

const JobAlertSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    keywords: [String],      
    location: { type: String },

    jobType: {
        type: String,
        enum: ["Full-time", "Part-time", "Internship", "Contract"]
    },

    educationLevel: {
        type: String,
        enum: ["Student", "Bachelor's Degree", "Master's Degree", "PhD", "Other"]
    },

    experienceLevel: {
        type: String,
        enum: ["Internship", "Entry-level", "Mid-level", "Senior"]
    },

    frequency: {
        type: String,
        enum: ["Daily", "Weekly", "Monthly"],
        default: "Weekly"
    },

    email_notification: {
        type: Boolean,
        default: true
    },

    in_app_notification: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

module.exports = mongoose.model("JobAlert", JobAlertSchema);
