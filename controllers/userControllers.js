const { User, JobSeeker, Employer, Admin } = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // ================= Validation =================
        if (!name || !email || !password || !role) {
            return res.status(400).json({ err: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ err: "Email already registered" });
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                err: "Password must be ≥8 chars, include uppercase, number, and special char",
            });
        }

        // ================= Hash Password =================
        const hashedPassword = await bcrypt.hash(password, 10);

        // ================= Create User by Role =================
        let user;
        if (role === "jobSeeker") {
            const { profilePhoto, skills, experience, education, certificates } = req.body;
            user = new JobSeeker({
                name,
                email,
                password: hashedPassword,
                profilePhoto,
                skills,
                experience,
                education,
                certificates,
            });
        } else if (role === "employer") {
            const { companyId } = req.body;
            user = new Employer({
                name,
                email,
                password: hashedPassword,
                companyId,
            });
        } else if (role === "admin") {
            user = new Admin({ name, email, password: hashedPassword });
        } else {
            return res.status(400).json({ err: "Invalid role" });
        }

        await user.save();
        console.log("Saved user:", user);

        // ================= Response =================
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================= LOGIN =================

const login = async (req, res) => {
    try {
        // ==================================
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ err: "All fields are required" });
        }
        // ==========================================
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ err: "this not registerd email" });
        }
        // ========== Compare Password ==========
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ err: "Invalid credentials" });
        }
        // =========================
        const token = jwt.sign(
            { id: existingUser._id, role: existingUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        // ========== Response ==========
        // existingUser = existingUser.select("-password")
        res.status(200).json({
            message: "Login successful",
            token,
            user: existingUser
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// ================= Update Profile  =================

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;
        console.log("Incoming body:", req.body);


        const allowedFields = [
            "name",
            "email",
            "profilePhoto",
            "skills",
            "experience",
            "education",
            "certificates"
        ];

        const filteredUpdates = {};
        for (let key of allowedFields) {
            if (updates[key] !== undefined) {
                filteredUpdates[key] = updates[key];
            }
        }
       
        const updatedUser = await JobSeeker.findByIdAndUpdate(
            userId,
            { $set: filteredUpdates },
            { new: true, runValidators: true }
        ).select("-password"); //=>>updateAll-!pass

console.log(updatedUser)
        res.status(200).json({
            message: "Profile updated successfully",
             updatedUser
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// ================= Change Password =================
const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ err: "Both old and new password required" });
        }

        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ err: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ err: "Old password is incorrect" });
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                err: "Password must be ≥8 chars, include uppercase, number, and special char"
            });
        }

        existingUser.password = await bcrypt.hash(newPassword, 10);
        await existingUser.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================= View Profile  =================
const viewProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ err: "User not found" });
        }

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// ================= Admin View Any User Profile =================
const viewUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(req.user.role)
        if (req.user.role != "admin" && req.user.role != "employer") {
            return res.status(403).json({ err: "Access denied." });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ err: "User not found" });
        }

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = { register, login, updateProfile, viewProfile, viewUserProfile, changePassword };
