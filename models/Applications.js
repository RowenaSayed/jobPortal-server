const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        coverLetter: {
            type: String,
            trim: true
        },
        resume: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["Applied", "Pending", "Approved", "Rejected"],
            default: "Applied"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Application", ApplicationSchema);
