const mongoose = require('mongoose');

const options = { discriminatorKey: "role", timestamps: true };

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, options);

const User = mongoose.model("User", UserSchema);

// ================================================
const JobSeekerSchema = new mongoose.Schema({
    profilePhoto: { type: String },
    skills: [String],
    experience: [{ type: String }],
    education: [{ type: String }],
    certificates: [{ type: String }]
});

const JobSeeker = User.discriminator("jobSeeker", JobSeekerSchema);

// ================================================
const EmployerSchema = new mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" }
});

const Employer = User.discriminator("employer", EmployerSchema);

// ================================================
const AdminSchema = new mongoose.Schema({});

const Admin = User.discriminator("admin", AdminSchema);

module.exports = { User, JobSeeker, Employer, Admin };
