const express = require('express');
const router = express.Router();
const { getCurrentUser, getAllUsers } = require('../controllers/userController');
const authorize = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate'); 

// /api/users/

router.get('/me', authenticate, authorize('User', 'Hotel', 'Chef'), getCurrentUser); 
router.get('/', authenticate, authorize('Hotel', 'Chef'), getAllUsers); 

module.exports = router;