const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    category: String,
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    images: [String],
    reviews: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            rating: Number,
            comment: String,
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);