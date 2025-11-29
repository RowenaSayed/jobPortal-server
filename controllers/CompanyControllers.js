const Company = require("../models/Company");
const { Employer } = require("../models/User");
const Review = require("../models/review");

// ============ CREATE COMPANY ============
const createCompany = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId || req.user.role !== "Employer") {
            return res.status(403).json({ error: "Only employers can create companies" });
        }

        const { name, description, logo, industry, website, location } = req.body;

        if (!name || !description)
            return res.status(400).json({ error: "Name and description are required" });

        // Create company
        const company = await Company.create({
            name,
            description,
            logo,
            industry,
            website,
            location
        });

        // Link employer → company
        await Employer.findByIdAndUpdate(userId, { companyId: company._id });

        res.status(201).json({
            message: "Company created successfully",
            company
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ============ UPDATE COMPANY ============
const updateCompany = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId || req.user.role !== "Employer")
            return res.status(403).json({ error: "Only employers can update companies" });

        const employer = await Employer.findById(userId);

        if (!employer || !employer.companyId)
            return res.status(404).json({ error: "No company assigned to your account" });

        const allowedFields = ["name", "description", "logo", "industry", "website", "location"];
        const updates = {};

        allowedFields.forEach(key => {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        });

        const company = await Company.findByIdAndUpdate(
            employer.companyId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: "Company updated",
            company
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ============ VIEW COMPANY (Employer/Admin) ============
const viewCompany = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId || !["Employer", "Admin"].includes(req.user.role))
            return res.status(403).json({ error: "Unauthorized" });

        const employer = await Employer.findById(userId).populate("companyId");

        if (!employer || !employer.companyId)
            return res.status(404).json({ error: "No company associated with this user" });

        const companyReviews = await Review.find({ companyId: employer.companyId._id })
            .populate("user", "name profilePhoto");

        res.status(200).json({
            company: employer.companyId,
            reviews: companyReviews
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ============ VIEW COMPANY (Public) ============
const viewUserCompany = async (req, res) => {
    try {
        const { companyId } = req.params;

        const company = await Company.findById(companyId);
        if (!company)
            return res.status(404).json({ error: "Company not found" });

        const companyReviews = await Review.find({ companyId })
            .populate("user", "name profilePhoto");

        res.status(200).json({
            company,
            reviews: companyReviews
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createCompany,
    updateCompany,
    viewCompany,
    viewUserCompany
};
