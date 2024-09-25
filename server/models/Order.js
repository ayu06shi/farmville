const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    consumerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Product",
        },
        quantity: {
            type: Number,
            required: true,
        },
    }],
    totalPrice: {
        type: number,
        required: true,
    },
    status: {
        enum: ['Pending', 'Delivered', 'Canceled'],
        required: true,
    },
    deliveryAddress: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
    },
})

module.exports = mongoose.model('order', orderSchema);