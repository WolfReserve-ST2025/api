const Reservation = require("../models/Reservation")
const Room = require("../models/Room")

// Get all reservations
exports.getAllReservations = async (req, res) => {
    const role = req.user.role;
    const userId = req.user.id;

    try {
        if (role === 'User') {
            const reservations = await Reservation.find({ userId: userId })
                .populate('roomId')
                .populate('userId');
            return res.json(reservations);
        }
        if (role === 'Hotel') {

            const rooms = await Room.find({ userId: userId });

            const roomIds = rooms.map(room => room._id);

            const reservations = await Reservation.find({ roomId: { $in: roomIds } })
                .populate('roomId')
                .populate('userId');

            return res.json(reservations);
        }

        const reservations = await Reservation.find()
            .populate('roomId')
            .populate('userId');

        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get reservation by ID
exports.getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
        .populate('roomId')
        .populate('userId');

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new reservation get user Id from token
exports.createReservation = async (req, res) => {
    const { personCount, reservedDateFrom, reservedDateTo, roomId } = req.body;
    const userId = req.user.id;

    try {

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const reservedDateFromDate = new Date(reservedDateFrom);
        const reservedDateToDate = new Date(reservedDateTo);

        const existingReservation = await Reservation.findOne({
            roomId: roomId,
            reservedDateFrom: { $lte: reservedDateToDate },
            reservedDateTo: { $gte: reservedDateFromDate }
        });

        if (existingReservation) {
            return res.status(400).json({ message: 'Room is already reserved for the selected dates' });
        }

        const pricePerNight = room.pricePerNight;
       
        const timeDiff = Math.abs(reservedDateToDate - reservedDateFromDate);
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const totalPrice = diffDays * pricePerNight;

        const newReservation = new Reservation({
            personCount,
            totalPrice,
            reservedDateFrom,
            reservedDateTo,
            roomId,
            userId
        });

        await newReservation.save();
        res.status(201).json(newReservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// accept reservation
exports.reserveRoom = async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            { isAccepted: true },
            { isReserved: true },
            { new: true }
        );

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.cancelReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            { isAccepted: false },
            { isReserved: false }
        );

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// delete reservation
exports.deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.id);

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};