const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0, 
    },
    description: {
        type: String,
        trim: true,
    },
    type: {
        type: String,
        trim: true,
    },
    imageUrl: {
        type: String,
        trim: true,
    }
}, { timestamps: true });

const Food = mongoose.model('Food', foodSchema)
module.exports = Food;