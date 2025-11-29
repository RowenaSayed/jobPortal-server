const mongoose = require("mongoose");

const options = { discriminatorKey: "role", timestamps: true };

// ================== BASE USER ==================
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    profilePhoto: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: {
        type: String,
        required: true,
        // Optional validation if you want schema-level enforcement
        // match: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
    },
    isActive: { type: Boolean, default: true }
}, options);

const User = mongoose.model("User", UserSchema);

// ================== JOB SEEKER ==================
const JobSeekerSchema = new mongoose.Schema({
    personalHeadline: { type: String },
    about: { type: String },
    location: { type: String },
    resume: { type: String },
    skills: [String],
    experience: [String],
    education: [String],
    certificates: [String]
});

const JobSeeker = User.discriminator("JobSeeker", JobSeekerSchema);

// ================== EMPLOYER ==================
const EmployerSchema = new mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" }
});

const Employer = User.discriminator("Employer", EmployerSchema);

// ================== ADMIN ==================
const AdminSchema = new mongoose.Schema({});

const Admin = User.discriminator("Admin", AdminSchema);

module.exports = { User, JobSeeker, Employer, Admin };
