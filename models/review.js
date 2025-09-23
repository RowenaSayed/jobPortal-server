const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",   
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",      
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    description: {
        type: String
    }
}, { timestamps: true });

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
