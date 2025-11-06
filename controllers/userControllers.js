const { User, JobSeeker, Employer, Admin } = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Basic validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const normalizedEmail = email.toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Password validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                error: "Password must be ≥8 chars, include uppercase, number, and special char"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let user;

        // Create user based on role
        if (role === "JobSeeker") {
            const {
                profilePhoto,
                personalHeadline,
                about,
                location,
                resume,
                skills,
                experience,
                education,
                certificates
            } = req.body;

            user = new JobSeeker({
                name,
                email: normalizedEmail,
                password: hashedPassword,
                profilePhoto,
                personalHeadline,
                about,
                location,
                resume,
                skills,
                experience,
                education,
                certificates
            });

        } else if (role === "Employer") {
            const { companyId } = req.body;
            user = new Employer({
                name,
                email: normalizedEmail,
                password: hashedPassword,
                companyId
            });

        } else if (role === "Admin") {
            user = new Admin({
                name,
                email: normalizedEmail,
                password: hashedPassword
            });

        } else {
            return res.status(400).json({ error: "Invalid role" });
        }

        await user.save();

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================= LOGIN =================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "All fields are required" });

        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user)
            return res.status(400).json({ error: "This email is not registered" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const { password: _, ...userData } = user.toObject();

        res.status(200).json({
            message: "Login successful",
            token,
            user: userData
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================= UPDATE PROFILE =================
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;

        const allowedFieldsByRole = {
            JobSeeker: [
                "name",
                "email",
                "profilePhoto",
                "personalHeadline",
                "about",
                "location",
                "resume",
                "skills",
                "experience",
                "education",
                "certificates"
            ],
            Employer: ["name", "email", "companyId"],
            Admin: ["name", "email"]
        };

        const allowedFields = allowedFieldsByRole[req.user.role] || [];
        const filteredUpdates = {};
        for (let key of allowedFields) {
            if (updates[key] !== undefined) filteredUpdates[key] = updates[key];
        }

        const Model =
            req.user.role === "JobSeeker"
                ? JobSeeker
                : req.user.role === "Employer"
                    ? Employer
                    : User;

        const updatedUser = await Model.findByIdAndUpdate(
            userId,
            { $set: filteredUpdates },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) return res.status(404).json({ error: "User not found" });

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================= CHANGE PASSWORD =================
const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword)
            return res.status(400).json({ error: "Both old and new password required" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch)
            return res.status(400).json({ error: "Old password is incorrect" });

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                error: "Password must be ≥8 chars, include uppercase, number, and special char"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================= VIEW OWN PROFILE =================
const viewProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================= ADMIN / EMPLOYER VIEW ANY USER =================
const viewUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        if (req.user.role !== "Admin" && req.user.role !== "Employer") {
            return res.status(403).json({ error: "Access denied" });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    register,
    login,
    updateProfile,
    changePassword,
    viewProfile,
    viewUserProfile
};
