const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['suite', 'basic', 'deluxe', 'family', 'single', 'double', 'triple'],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    pricePerNight: {
        type: Number,
        required: true,
    },
    maxPersonCount: {
        type: Number,
        required: true,
    },
    imgUrl: [{
        type: String,
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;