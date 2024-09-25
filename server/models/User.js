const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        }
    ],
    description: {
        type: String,
    },
    role: {
        type: String,
        enum: ['Admin', 'Farmer', 'Consumer'],
        required: true,
    },
}, {timestamps: true})

module.exports = mongoose.model('user', userSchema);