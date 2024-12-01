const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    description: String,
    images: [{ data: Buffer, contentType: String }],
    status: { type: String, enum: ['available', 'out_of_stock'], default: 'available' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', ProductSchema);