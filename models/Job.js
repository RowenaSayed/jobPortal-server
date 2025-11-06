const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    location: { type: String },
    jobType: {
        type: String,
        enum: ["Full-time", "Part-time", "Internship", "Contract"],
        default: "Full-time"
    },
    educationLevel: {
        type: String,
        enum: ["Student", "Bachelor's Degree", "Master's Degree", "PhD", "Other"],
        default: "Bachelor's Degree"
    },
    experienceLevel: {
        type: String,
        enum: ["Internship", "Entry-level", "Mid-level", "Senior"],
        default: "Entry-level"
    },
    salary: {
        min: Number,
        max: Number,
        currency: {
            type: String,
            enum: ["USD ($)", "EUR (€)", "EGP (£)"],
            default: "USD ($)"
        },
        benefitsOffered:{ type: String},
    },
    description: { type: String, required: true },
    skillsRequired: [String],
    additionalRequirements: { type: String },
    applicationMethod: {
        type: String,
        enum: ["Apply on JobLink", "External Link", "Email"],
        default: "Apply on JobLink"
    },
    deadline: { type: Date, required: true },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
}, { timestamps: true });

const Job = mongoose.model("Job", JobSchema);
module.exports = Job;
