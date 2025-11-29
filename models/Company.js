const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    logo: {
        type: String,
        default: null
    },
    industry: { type: String },
    website: { type: String },
    location: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Company", CompanySchema);
