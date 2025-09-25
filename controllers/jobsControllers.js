const Job = require('../models/Job')
// add job

const createJob = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.id) {
            return res.status(401).json({
                message: "Unauthorized - user not found"
            });
        }

        if (user.role !== "employer") {
            return res.status(403).json({
                message: "You are denied to add job"
            });
        }

        if (!user.companyId) {
            return res.status(400).json({
                message: "Company ID is required to add job"
            });
        }

        const companyId = user.companyId;

        const {
            title,
            location,
            jobType,
            educationLevel,
            experienceLevel,
            salary,
            description,
            skillsRequired,
            deadline
        } = req.body;
        if (!title || !description || !deadline) {
            return res.status(400).json({
                message: "title, description, and deadline are required"
            });
        }
        const newJob = await Job.create({
            title,
            company: companyId,
            location,
            jobType,
            educationLevel,
            experienceLevel,
            salary,
            description,
            skillsRequired,
            deadline
        });

        res.status(201).json({ message: "job added successfully", newJob });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}
// update job

const updateJob = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;

        const job = await Job.findOneAndUpdate(
            { _id: id, company: user.companyId },
            { $set: req.body },
            { new: true }
        );

        if (!job) {
            return res.status(404).json({ error: "Job not found or not authorized" });
        }

        res.json({ message: "Job updated successfully", job });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// delete job

const deleteJob = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;
        const deletedJob = await Job.findOneAndDelete({ _id: id, company: user.companyId });
        if (!deletedJob) {
            return res.status(404).json({ error: "Job not found or not authorized" });
        }

        res.json({ message: "Job deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
// retreive all jobs for all users
const getAllJobs = async (req, res) => {
    try {
        const allJobs = await Job.find().select('-applicants').sort({ createdAt: -1 });
        res.json(allJobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
//retrive my jobs
const getAllEmployerJobs = async (req, res) => {
    try {
        const user = req.user;

        if (!user || !user.id) {
            return res.status(401).json({ message: "Unauthorized - user not found" });
        }

        if (user.role !== "employer") {
            return res.status(403).json({ message: "You are denied (just for Employers)" });
        }

        const selectedJobs = await Job.find({ company: user.companyId })
            .populate("company", "name")
            .sort({ createdAt: -1 });

        if (!selectedJobs || selectedJobs.length === 0) {
            return res.status(404).json({ message: "No jobs found for this employer" });
        }

        res.status(200).json(selectedJobs);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// retreive just my applications for my jobs
const getMyJobsApplications = async (req, res) => {
    try {
        const user = req.user;

        if (!user || !user.id) {
            return res.status(401).json({ message: "Unauthorized - user not found" });
        }

        if (user.role !== "employer") {
            return res.status(403).json({ message: "You are denied (just for Employers)" });
        }

        const selectedJobs = await Job.find({ company: user.companyId })
            .populate("applicants", "-password")
            .sort({ createdAt: -1 });

        if (!selectedJobs || selectedJobs.length === 0) {
            return res.status(404).json({ message: "No jobs found for this employer" });
        }

        const applicants = selectedJobs.flatMap(job =>
            job.applicants.map(a => ({
                ...a._doc,
                jobTitle: job.title,
                // jobId: job._id
            }))
        );

        // const applicants = selectedJobs.flatMap(job => job.applicants);

        if (applicants.length === 0) {
            return res.status(404).json({ message: "No applicants found for your jobs" });
        }

        res.status(200).json(applicants);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//job details

const getJobDetails = async (req, res) => {
    try {

        const { id } = req.params; 

        const job = await Job.findOne({ _id: id }).select('-applicants')

        if (!job) {
            return res.status(404).json({ message: " job not found" });
        }

        return res.status(200).json({ job });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};
module.exports = {
    createJob,
    updateJob,
    deleteJob,
    getAllJobs,
    getAllEmployerJobs,
    getMyJobsApplications,
    getJobDetails
}