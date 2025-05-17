const express = require('express');
const router = express.Router();
const { orderFood, confirmRejectOrder } = require('../controllers/orderController');
const authorize = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate'); 

router.post('/', authenticate, authorize('User'), orderFood); 
router.put('/:order_id', authenticate, authorize(' Chef'), confirmRejectOrder); 

module.exports = router;