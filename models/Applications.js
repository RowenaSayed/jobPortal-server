const Application = require("../models/Application");
const Job = require("../models/Job");

// ================== APPLY FOR JOB ==================
const applyForJob = async (req, res) => {
    try {
        const userId = req.user.id;
        const { jobId, coverLetter, resume } = req.body;

        if (req.user.role !== "JobSeeker") return res.status(403).json({ error: "Access denied" });

        const application = new Application({ job, applicant: req.user.id, coverLetter, resume });
        await application.save();


        if (!jobId || !resume) {
            return res.status(400).json({ error: "Job ID and resume are required" });
        }

        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existingApplication) {
            return res.status(400).json({ error: "You have already applied for this job" });
        }

        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
            coverLetter,
            resume
        });

        res.status(201).json({ message: "Application submitted successfully", application: newApplication });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================== GET ALL APPLICATIONS (Applicant) ==================
const getMyApplications = async (req, res) => {
    try {
        const userId = req.user.id;
        if (req.user.role !== "JobSeeker") return res.status(403).json({ error: "Access denied" });

        const applications = await Application.find({ applicant: userId })
            .populate({
                path: "job",
                select: "title location company"
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ applications });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================== GET SINGLE APPLICATION (Applicant) ==================
const getSingleApplication = async (req, res) => {
    try {
        const userId = req.user.id;
        if (req.user.role !== "JobSeeker") return res.status(403).json({ error: "Access denied" });

        const { applicationId } = req.params;

        const application = await Application.findOne({
            _id: applicationId,
            applicant: userId
        }).populate({
            path: "job",
            select: "title location company"
        });

        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        res.status(200).json({ application });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================== UPDATE APPLICATION (Applicant) ==================
const updateApplication = async (req, res) => {
    try {
        const userId = req.user.id;
        if (req.user.role !== "JobSeeker") return res.status(403).json({ error: "Access denied" });

        const { applicationId } = req.params;
        const { coverLetter, resume } = req.body;

        const application = await Application.findOneAndUpdate(
            { _id: applicationId, applicant: userId },
            { coverLetter, resume },
            { new: true, runValidators: true }
        );

        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        res.status(200).json({ message: "Application updated", application });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================== DELETE APPLICATION (Applicant) ==================
const deleteApplication = async (req, res) => {
    try {
        const userId = req.user.id;
        if (req.user.role !== "JobSeeker") return res.status(403).json({ error: "Access denied" });
        const { applicationId } = req.params;

        const application = await Application.findOneAndDelete({
            _id: applicationId,
            applicant: userId
        });

        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        res.status(200).json({ message: "Application deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================== EMPLOYER VIEW APPLICATIONS ==================
const getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;

        const applications = await Application.find({ job: jobId })
            .populate("applicant", "name email profilePhoto")
            .populate("job", "title location");

        res.status(200).json({ applications });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================== UPDATE STATUS (Employer/Admin) ==================
const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        if (!["Pending", "Approved", "Rejected"].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const application = await Application.findByIdAndUpdate(
            applicationId,
            { status },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        res.status(200).json({ message: "Status updated", application });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    applyForJob,
    getMyApplications,
    getSingleApplication,
    updateApplication,
    deleteApplication,
    getJobApplications,
    updateApplicationStatus
};
