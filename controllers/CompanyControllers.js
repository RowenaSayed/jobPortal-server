const Company = require('../models/Company');
const { Employer } = require('../models/User');
const Review = require('../models/review');

//=======CREATE COMPANY======================
const createCompany = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { name, description, logo } = req.body;
        if (!name || !description) {
            return res.status(400).json({ error: "name and description are required" });
        }

        const company = new Company({ name, description, logo });
        await company.save();

        await Employer.findByIdAndUpdate(userId, { companyId: company._id });

        return res.status(201).json({ message: "Company created", company });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
//=======UPDATE COMPANY======================
const updateCompany = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, description, logo } = req.body;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const employer = await Employer.findById(userId);
        if (!employer || !employer.companyId) {
            return res.status(404).json({ error: "No company associated with this user" });
        }

        // =================================================
        const companyId = employer.companyId;

        const company = await Company.findByIdAndUpdate(
            companyId,
            { name, description, logo },
        )
        return res.status(200).json({ message: "Company updated", company });

    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

///=======VIEW COMPANY======================
const viewCompany = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const employer = await Employer.findById(userId).populate('companyId');
        if (!employer || !employer.companyId) {
            return res.status(404).json({ error: "No company associated with this user" });
        }

        const companyReviws = await Review.find({ companyId: employer.companyId }).populate({
            path: 'user',
            select: 'name profilePhoto'
        })
        return res.status(200).json({ company: employer.companyId }, companyReviws);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
///=======VIEW COMPANY for users and admin==
const viewUserCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ err: "Company not found" });
        }
        const companyReviws = await Review.find({ companyId }).populate({
            path: 'user',
            select: 'name profilePhoto'
        })

        res.status(200).json({ company, reviews: companyReviws });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
//=======VIEW COMPANY REVIEWS ======================


module.exports = { createCompany, updateCompany, viewCompany };
