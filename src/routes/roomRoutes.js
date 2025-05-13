const express = require('express');
const router = express.Router();
const { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const authorize = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate'); 


// /api/rooms/

router.get('/', authenticate, authorize('Hotel', 'Chef', 'User'), getAllRooms); // Get all rooms
router.get('/:id', authenticate, authorize('User'), getRoomById); // Get room by ID
router.post('/', authenticate, authorize('Hotel'), createRoom); // Create a new room
router.put('/:id', authenticate, authorize('Hotel'), updateRoom); // Update a room
router.delete('/:id', authenticate, authorize('Hotel'), deleteRoom); // Delete a room

module.exports = router;