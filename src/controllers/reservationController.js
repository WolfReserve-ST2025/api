const Reservation = require("../models/Reservation")

// Get all reservations
exports.getAllReservations = async (req, res) => {
    const role = req.user.role;
    const userId = req.user.id;

    try {
        // if role is user show only users is is hotel show all reservations which rooms are linked with userId via room

        if (role === 'User') {
            const reservations = await Reservation.find({ userId: userId })
                .populate('roomId')
                .populate('userId');
            return res.json(reservations);
        }
        if (role === 'Hotel') {
            const reservations = await Reservation.find({ roomId: { $in: userId } })
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
        const reservation = await Reservation.findById(req.params.id).populate('roomId').populate('userId');
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
    const { personCount, totalPrice, reservedDateFrom, reservedDateTo, roomId } = req.body;
    const userId = req.user.id;

    try {
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