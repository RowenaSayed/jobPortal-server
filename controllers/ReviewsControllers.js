const Review = require('../models/review');
const Company = require('../models/Company');
const { User } = require("../models/User");

const addReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { companyId, rating, description } = req.body;

        if (!companyId || !rating) {
            return res.status(400).json({ error: "companyId and rating are required" });
        }

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }

        const review = new Review({ companyId, user: userId, rating, description });
        await review.save();

        company.reviews.push(review._id);
        await company.save();

        return res.status(201).json({ message: "Review added", review });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updateReview = async (req, res) => {
    try {
       const {reviewId
    } = req.params;
        console.log(reviewId)
        const userId = req.user.id;
        const { rating, description } = req.body;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        if (review.user.toString() !== userId) {
            return res.status(403).json({ error: "Forbidden: cannot update another user's review" });
        }

        if (rating) review.rating = rating;
        if (description) review.description = description;

        await review.save();
        return res.status(200).json({ message: "Review updated", review });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        if (review.user.toString() !== userId) {
            return res.status(403).json({ error: "Forbidden: cannot delete another user's review" });
        }

        await review.deleteOne();
        await Company.findByIdAndUpdate(review.companyId, { $pull: { reviews: review._id } });

        return res.status(200).json({ message: "Review deleted" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = { addReview, updateReview, deleteReview };
