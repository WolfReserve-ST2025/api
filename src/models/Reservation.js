const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    personCount: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    reservedDateFrom: {
        type: Date,
    },
    reservedDateTo: {
        type: Date,
    },
    roomId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Room',
         required: true,
    },
    userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
    },
    isAccepted: {
        type: Boolean,
        default: false,
    },
    isReserved: {
        type: Boolean,
        default: false,
    },
    
}, { timestamps: true });

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;