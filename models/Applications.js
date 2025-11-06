const mongoose = require("mongoose");
const ApplicationSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    coverLetter: { type: String },
    resume: { type: String, required: true },
    status: {
        type: String,
        enum: ["Applied", "pending", "Approved", "Rejected"],
        default: "Applied"
    }
}, { timestamps: true });
const Application = mongoose.model("Application", ApplicationSchema);
module.exports = Application;
