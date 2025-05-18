const express = require('express');
const router = express.Router();
const { getAllReservations, getReservationById, createReservation, reserveRoom, cancelReservation, deleteReservation } = require('../controllers/reservationController');
const authorize = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate'); 

// /api/reservations/
router.get('/', authenticate, authorize('Hotel', 'Chef', 'User'), getAllReservations); // Get all reservations
router.get('/:id', authenticate, authorize('User'), getReservationById); // Get reservation by ID
router.post('/', authenticate, authorize('User'), createReservation); // Create a new reservation
router.put('/reserveRoom/:id', authenticate, authorize('Hotel'), reserveRoom); // Accept a reservation
router.put('/reject/:id', authenticate, authorize('Hotel'), cancelReservation); // Reject a reservation
router.delete('/:id', authenticate, authorize('User'), deleteReservation); // Delete a reservation

module.exports = router;
