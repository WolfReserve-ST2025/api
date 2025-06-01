const express = require('express');
const router = express.Router();
const { addSubscription } = require('../controllers/subscriptionController');
const authorize = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate'); 


router.post('/', authenticate, authorize('Hotel', 'Chef', 'User'), addSubscription); 


module.exports = router;