const Job = require("../models/Job");
const Application = require("../models/Applications");
const triggerJobAlerts = require("../utils/triggerJobsAlert");


//  Create a single job (Employers only)
const createJob = async (req, res) => {
    try {
        const user = req.user;

        if (!user || !user.id) {
            return res.status(401).json({ message: "Unauthorized - user not found" });
        }

        if (user.role !== "Employer") {
            return res.status(403).json({ message: "Access denied - only employers can post jobs" });
        }

        if (!user.companyId) {
            return res.status(400).json({ message: "Company ID is required to add a job" });
        }

        const {
            title,
            location,
            jobType,
            educationLevel,
            experienceLevel,
            salary_min,
            salary_max,
            salary_currency,
            benefitsOffered,
            description,
            skillsRequired,
            additionalRequirements,
            applicationMethod,
            deadline,
        } = req.body;

        if (!title || !description || !deadline) {
            return res.status(400).json({ message: "Title, description, and deadline are required" });
        }

        const validJobTypes = ["Full-time", "Part-time", "Internship", "Contract"];
        const validEducationLevels = ["Student", "Bachelor's Degree", "Master's Degree", "PhD", "Other"];
        const validExperienceLevels = ["Internship", "Entry-level", "Mid-level", "Senior"];
        const validCurrencies = ["USD ($)", "EUR (€)", "EGP (£)"];
        const validApplicationMethods = ["Apply on JobLink", "External Link", "Email"];

        if (jobType && !validJobTypes.includes(jobType)) {
            return res.status(400).json({ message: `Invalid job type. Valid options: ${validJobTypes.join(", ")}` });
        }
        if (educationLevel && !validEducationLevels.includes(educationLevel)) {
            return res.status(400).json({ message: `Invalid education level. Valid options: ${validEducationLevels.join(", ")}` });
        }
        if (experienceLevel && !validExperienceLevels.includes(experienceLevel)) {
            return res.status(400).json({ message: `Invalid experience level. Valid options: ${validExperienceLevels.join(", ")}` });
        }
        if (salary_currency && !validCurrencies.includes(salary_currency)) {
            return res.status(400).json({ message: `Invalid salary currency. Valid options: ${validCurrencies.join(", ")}` });
        }
        if (applicationMethod && !validApplicationMethods.includes(applicationMethod)) {
            return res.status(400).json({ message: `Invalid application method. Valid options: ${validApplicationMethods.join(", ")}` });
        }

        const newJob = await Job.create({
            title,
            company: user.companyId,
            location,
            jobType,
            educationLevel,
            experienceLevel,
            salary_min,
            salary_max,
            salary_currency,
            benefitsOffered,
            description,
            skillsRequired,
            additionalRequirements,
            applicationMethod,
            deadline,
            status: "pending",
        });

        // ====== Trigger Job Alerts ======
        triggerJobAlerts({
            ...newJob.toObject(),
            skills: newJob.skillsRequired 
        });

        return res.status(201).json({
            message: "Job added successfully",
            job: newJob,
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};


//  Create multiple jobs (bulk insert)
const createMultipleJobs = async (req, res) => {
    try {
        const user = req.user;

        if (!user || user.role !== "Employer") {
            return res.status(403).json({ message: "Access denied - only employers can post jobs" });
        }

        if (!user.companyId) {
            return res.status(400).json({ message: "Company ID is required to add jobs" });
        }

        const jobs = req.body.jobs;
        if (!Array.isArray(jobs) || jobs.length === 0) {
            return res.status(400).json({ message: "Please provide an array of job objects" });
        }

        const validJobTypes = ["Full-time", "Part-time", "Internship", "Contract"];
        const validEducationLevels = ["Student", "Bachelor's", "Master's", "PhD", "Other"];
        const validExperienceLevels = ["Internship", "Entry-level", "Mid-level", "Senior"];
        const validCurrencies = ["USD ($)", "EUR (€)", "EGP (£)"];
        const validApplicationMethods = ["Apply on JobLink", "External Link", "Email"];

        // 🧩 Validate and attach company ID
        const preparedJobs = jobs.map((job, index) => {
            const { title, description, deadline } = job;
            if (!title || !description || !deadline) {
                throw new Error(`Missing required fields in job at index ${index}`);
            }

            if (job.jobType && !validJobTypes.includes(job.jobType)) {
                throw new Error(`Invalid job type at index ${index}`);
            }
            if (job.educationLevel && !validEducationLevels.includes(job.educationLevel)) {
                throw new Error(`Invalid education level at index ${index}`);
            }
            if (job.experienceLevel && !validExperienceLevels.includes(job.experienceLevel)) {
                throw new Error(`Invalid experience level at index ${index}`);
            }
            if (job.salary_currency && !validCurrencies.includes(job.salary_currency)) {
                throw new Error(`Invalid salary currency at index ${index}`);
            }
            if (job.applicationMethod && !validApplicationMethods.includes(job.applicationMethod)) {
                throw new Error(`Invalid application method at index ${index}`);
            }

            return {
                ...job,
                company: user.companyId,
                status: "pending",
            };
        });

        const createdJobs = await Job.insertMany(preparedJobs);

        return res.status(201).json({
            message: `${createdJobs.length} jobs added successfully`,
            jobs: createdJobs,
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

//  Update job
const updateJob = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;

        if (user.role !== "Employer") {
            return res.status(403).json({ message: "Access denied" });
        }

        const job = await Job.findOneAndUpdate(
            { _id: id, company: user.companyId },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!job) {
            return res.status(404).json({ message: "Job not found or not authorized" });
        }

        res.status(200).json({ message: "Job updated successfully", job });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

//  Delete job
const deleteJob = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;

        if (user.role !== "Employer") {
            return res.status(403).json({ message: "Access denied" });
        }

        const deletedJob = await Job.findOneAndDelete({ _id: id, company: user.companyId });
        if (!deletedJob) {
            return res.status(404).json({ message: "Job not found or not authorized" });
        }

        res.status(200).json({ message: "Job deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

//  Retrieve all jobs (public)
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate("company", "name logo location")
            .sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//  Retrieve jobs for current employer
const getAllEmployerJobs = async (req, res) => {
    try {
        const user = req.user;

        if (!user || !user.id) {
            return res.status(401).json({ message: "Unauthorized - user not found" });
        }

        if (user.role !== "Employer") {
            return res.status(403).json({ message: "Access denied - only employers allowed" });
        }

        const jobs = await Job.find({ company: user.companyId })
            .populate("company", "name logo")
            .sort({ createdAt: -1 });

        if (!jobs.length) {
            return res.status(404).json({ message: "No jobs found for this employer" });
        }

        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//  Retrieve job details by ID
const getJobDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findById(id).populate("company", "name logo description location");

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.status(200).json({ job });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

//  Get all applications for my posted jobs (employer)
const getMyJobsApplications = async (req, res) => {
    try {
        const user = req.user;

        if (user.role !== "Employer") {
            return res.status(403).json({ message: "Access denied" });
        }

        const jobs = await Job.find({ company: user.companyId }).select("_id title");
        const jobIds = jobs.map((job) => job._id);

        const applications = await Application.find({ job: { $in: jobIds } })
            .populate("job", "title")
            .populate("applicant", "name email");

        res.status(200).json({ total: applications.length, applications });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

module.exports = {
    createJob,
    createMultipleJobs,
    updateJob,
    deleteJob,
    getAllJobs,
    getAllEmployerJobs,
    getMyJobsApplications,
    getJobDetails,
};
