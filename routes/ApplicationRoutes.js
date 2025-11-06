const express = require("express");
const router = express.Router();
const {
    applyForJob,
    getMyApplications,
    getSingleApplication,
    updateApplication,
    deleteApplication,
    getJobApplications,
    updateApplicationStatus
} = require("../controllers/applicantsControllers");

const { authMiddleware, authorize } = require("../middleware/auth");

// ===============================
// JOB SEEKER ROUTES
// ===============================

router.post("/", authMiddleware, authorize(["JobSeeker"]), applyForJob);

router.get("/", authMiddleware, authorize(["JobSeeker"]), getMyApplications);

router.get("/:applicationId", authMiddleware, authorize(["JobSeeker"]), getSingleApplication);

router.put("/:applicationId", authMiddleware, authorize(["JobSeeker"]), updateApplication);

router.delete("/:applicationId", authMiddleware, authorize(["JobSeeker"]), deleteApplication);


// ===============================
// EMPLOYER / ADMIN ROUTES
// ===============================

router.get("/job/:jobId", authMiddleware, authorize(["Employer", "Admin"]), getJobApplications);

router.patch("/:applicationId/status", authMiddleware, authorize(["Employer", "Admin"]), updateApplicationStatus);


module.exports = router;
