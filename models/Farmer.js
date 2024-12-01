const mongoose = require('mongoose');

const FarmerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    personalDetails: {
        firstName: String,
        lastName: String,
        phoneNumber: String,
        address: String,
        email: String
    },
    farmDetails: {
        farmName: String,
        farmSize: Number,
        location: String,
    },
    approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    rejectionReason: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Farmer', FarmerSchema);