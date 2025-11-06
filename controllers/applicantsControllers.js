const Application = require("../models/Applications");
const Job = require("../models/Job");

// ================== APPLY FOR JOB ==================
const applyForJob = async (req, res) => {
    try {
        const userId = req.user.id;
        const { jobId, coverLetter, resume } = req.body;

        if (req.user.role !== "JobSeeker")
            return res.status(403).json({ error: "Access denied: JobSeekers only" });

        if (!jobId || !resume) {
            return res.status(400).json({ error: "Job ID and resume are required" });
        }

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ error: "Job not found" });

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

// ================== GET ALL APPLICATIONS (JobSeeker) ==================
const getMyApplications = async (req, res) => {
    try {
        const userId = req.user.id;
        if (req.user.role !== "JobSeeker")
            return res.status(403).json({ error: "Access denied: JobSeekers only" });

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

// ================== GET SINGLE APPLICATION (JobSeeker) ==================
const getSingleApplication = async (req, res) => {
    try {
        const userId = req.user.id;
        if (req.user.role !== "JobSeeker")
            return res.status(403).json({ error: "Access denied: JobSeekers only" });

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

// ================== UPDATE APPLICATION (JobSeeker) ==================
const updateApplication = async (req, res) => {
    try {
        const userId = req.user.id;
        if (req.user.role !== "JobSeeker")
            return res.status(403).json({ error: "Access denied: JobSeekers only" });

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

// ================== DELETE APPLICATION (JobSeeker) ==================
const deleteApplication = async (req, res) => {
    try {
        const userId = req.user.id;
        if (req.user.role !== "JobSeeker")
            return res.status(403).json({ error: "Access denied: JobSeekers only" });

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

// ================== GET JOB APPLICATIONS (Employer/Admin) ==================
const getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;

        if (req.user.role !== "Employer" && req.user.role !== "Admin") {
            return res.status(403).json({ error: "Access denied: Employers/Admins only" });
        }

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

        if (req.user.role !== "Employer" && req.user.role !== "Admin") {
            return res.status(403).json({ error: "Access denied: Employers/Admins only" });
        }

        if (!["Applied", "Pending", "Approved", "Rejected"].includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        const application = await Application.findByIdAndUpdate(
            applicationId,
            { status },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        res.status(200).json({ message: "Status updated successfully", application });
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
