//saved jobs controllers CRD
const SavedJob = require('../models/SavedJobs');
const { User } = require('../models/User')
const Company = require('../models/Company')
const Job = require('../models/Job')

//add savedJob
const addSavedJob = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.id) {
            return res.status(401).json({
                message: "Unauthorized - user not found"
            });
        }

        if (user.role !== "JobSeeker") {
            return res.status(403).json({
                message: "You are denied to Save job"
            });
        }
        // =============================
        const { job } = req.body;
        if (!job) {
            return res.status(400).json({ message: "Job ID is required" });
        }
        const checkJob = await Job.findById(job);
        if (!checkJob) {
            return res.status(404).json({ message: "Job not found" });
        }
        //========================================
        const alreadySaved = await SavedJob.findOne({ user: user.id, job });
        if (alreadySaved) {
            return res.status(400).json({ message: "Job already saved" });
        }

        const savedJob = new SavedJob({
            user: user.id,
            job
        });

        await savedJob.save();

        return res.status(201).json({
            message: "Job saved successfully",
            savedJob
        });
    } catch (err) {
        return res.status(500).json({
            message: 'internal server Error',
            error:err.message
        })
    }
}
//Delete savedJob
const deleteSavedJob = async (req, res) => {
    try {
        const user = req.user;
    
        if (!user || !user.id) {
            return res.status(401).json({
                message: "Unauthorized - user not found"
            });
        }
        // =========================================================
        const { id } = req.params; 
        const savedJob = await SavedJob.findOne({ _id: id, user: user.id });
        if (!savedJob) {
            return res.status(404).json({ message: "Saved job not found" });
        }

        await SavedJob.findByIdAndDelete(id);

        return res.status(200).json({ message: "Saved job deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};
//get all my savedJobs
const getMySavedJobs = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.id) {
            return res.status(401).json({
                message: "Unauthorized - user not found"
            });
        }

        const savedJobs = await SavedJob.find({ user: user.id })
            .populate({ path: "job", select: "-applicants" })
            .sort({ createdAt: -1 });

        return res.status(200).json({ savedJobs });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};
//view my saved job details

const getSavedJobDetails = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.id) {
            return res.status(401).json({
                message: "Unauthorized - user not found"
            });
        }

        const { id } = req.params; 

        const savedJob = await SavedJob.findOne({ _id: id, user: user.id })
            .populate({ path: "job", select: "-applicants" })

        if (!savedJob) {
            return res.status(404).json({ message: "Saved job not found" });
        }

        return res.status(200).json({ savedJob });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

module.exports = {
    addSavedJob,
    deleteSavedJob,
    getMySavedJobs,
    getSavedJobDetails
}