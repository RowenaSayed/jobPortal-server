const { timeStamp } = require("console");
const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    location: { type: String },
    jobType: {
        type: String,
        enum: ["Full-time", "Part-time", "Internship", "Contract"],
        default: "Full-time"
    },
    educationLevel: {
        type: String,
        enum: ["student", "Bachelor", "Master", "PhD", "Other"],
        default: "Bachelor"
    },
    experienceLevel: {
        type: String,
        enum: ["Internship", "Entry-level", "Mid-level", "Senior"],
        default: "Entry-level"
    },
    salary: {
        min: { type: Number },
        max: { type: Number },
        currency: {
            type: String,
            enum: ["USD ($)", "EUR (€)", "EGP (£)"],
            default: "USD ($)"
        }
    },
    description: {
        type: String,
        required: true
    },
    skillsRequired: [String],
    applicants: [
        {
            applicant: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "JobSeeker",
                required: true
            },
            status: {
                type: String,
                enum: ["Applied", "Pending", "Accepted", "Rejected"],
                default: "Applied"
            }
        }
        //add timestamp
    ],
    deadline: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const Job = mongoose.model("Job", JobSchema);

module.exports = Job;
