const User = require('../models/User');
const Job = require('../models/Job');

// ================== TOGGLE USER ACCOUNT ==================
exports.toggleUserAccount = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({
            message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}`,
            user
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ================== APPROVE JOB ==================
exports.approveJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        job.status = "approved";
        await job.save();

        res.status(200).json({ message: 'Job has been approved', job });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ================== REJECT JOB ==================
exports.rejectJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        job.status = "rejected";
        await job.save();

        res.status(200).json({ message: 'Job has been rejected', job });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ================== GET ALL PENDING JOBS ==================
exports.getPendingJobs = async (req, res) => {
    try {
        const pendingJobs = await Job.find({ status: "pending" })
            .populate("company", "name");

        res.status(200).json({ pendingJobs });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
