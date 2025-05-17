const express = require('express');
const router = express.Router();
const { getCurrentUser, getAllUsers, updateUser, updateUserPassword } = require('../controllers/userController');
const authorize = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate'); 

// /api/users/

router.get('/me', authenticate, authorize('User', 'Hotel', 'Chef'), getCurrentUser); 
router.get('/', authenticate, authorize('Hotel', 'Chef'), getAllUsers); 
router.put('/update', authenticate, authorize('User', 'Hotel', 'Chef'), updateUser);
router.put('/update-password', authenticate, authorize('User', 'Hotel', 'Chef'), updateUserPassword);

module.exports = router;