const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['draft', 'pending', 'confirmed', 'rejected'], 
        default: 'draft', 
        required: true,
    },
    foods: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Food', 
            required: true,
        }
    ],
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true }); 

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;