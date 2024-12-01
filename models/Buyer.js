const mongoose = require('mongoose');

const BuyerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    personalDetails: {
        firstName: String,
        lastName: String,
        phoneNumber: String,
        address: String,
    },
    deliveryPreferences: {
        preferredDeliveryTime: String,
        deliveryAddress: String,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Buyer', BuyerSchema);