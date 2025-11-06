const JobAlert = require('../models/JobAlert');

// Create a new job alert
const createJobAlert = async (req, res) => {
    try {
        const jobAlert = new JobAlert({
            user: req.user._id,
            keywords: req.body.keywords,        
            location: req.body.location,
            jobType: req.body.jobType,
            educationLevel: req.body.educationLevel,
            experienceLevel: req.body.experienceLevel,
            frequency: req.body.frequency,
            email_notification: req.body.email_notification,
            in_app_notification: req.body.in_app_notification
        });
        await jobAlert.save();
        res.status(201).json(jobAlert);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all job alerts for the logged-in user
const getJobAlerts = async (req, res) => {
    try {
        const jobAlerts = await JobAlert.find({ user: req.user._id });
        res.status(200).json(jobAlerts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Update a job alert
const updateJobAlert = async (req, res) => {
    try {
        const jobAlert = await JobAlert.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true }
        );
        if (!jobAlert) {
            return res.status(404).json({ error: "Job alert not found" });
        }
        res.status(200).json(jobAlert);
    } catch (error) {   
        res.status(400).json({ error: error.message });
    }   
};
// Delete a job alert
const deleteJobAlert = async (req, res) => {
    try {

        const jobAlert = await JobAlert.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!jobAlert) {
            return res.status(404).json({ error: "Job alert not found" });
        }

        res.status(200).json({ message: "Job alert deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a specific job alert by ID
const getJobAlertById = async (req, res) => {
    try {
        const jobAlert = await JobAlert.findOne({ _id: req.params.id, user: req.user._id });
        if (!jobAlert) {
            return res.status(404).json({ error: "Job alert not found" });
        }
        res.status(200).json(jobAlert);
    }   

    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createJobAlert,
    getJobAlerts,
    updateJobAlert,
    deleteJobAlert,
    getJobAlertById
};