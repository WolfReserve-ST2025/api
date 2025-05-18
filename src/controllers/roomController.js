const Room = require('../models/Room');

// Get all rooms 
exports.getAllRoomsWithUser = async (req, res) => {
    try {
        const rooms = await Room.find().populate('user', 'name');
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.getAllRooms = async (req, res) => {
    const role = req.user.role;
    const userId = req.user.id;

    try {
        if(role === 'Hotel') {
            const rooms = await Room.find({ userId: userId });
            return res.json(rooms);
        }

        const rooms = await Room.find();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get room by ID
exports.getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Create a new room
exports.createRoom = async (req, res) => {
    const { name, type, description, pricePerNight, maxPersonCount, imgUrl } = req.body;

    const userId = req.user.id;
    try {
        const newRoom = new Room({
            name,
            type,
            description,
            pricePerNight,
            maxPersonCount,
            imgUrl,
            userId,
        });

        await newRoom.save();
        res.status(201).json(newRoom);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Update a room
exports.updateRoom = async (req, res) => {
    const { name, type, description, pricePerNight, maxPersonCount, imgUrl } = req.body;

    try {
        const room = await Room.findByIdAndUpdate(
            req.params.id,
            { name, type, description, pricePerNight, maxPersonCount, imgUrl },
            { new: true }
        );

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Delete a room
exports.deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};