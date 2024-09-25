const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    reply: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.ObjectId,
        required: true,
        ref: "User",
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model("Reply", replySchema);