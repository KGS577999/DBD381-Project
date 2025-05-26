// /models/Order.js
const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderItems: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number,
            price: Number
        }
    ],
    total: Number,
    status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);