const express = require('express');
const router = express.Router();
const { orderFood, confirmRejectOrder, addFood, getAllOrders, getOrderByUser } = require('../controllers/orderController');
const authorize = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate'); 

router.get('/', authenticate, authorize('User'), getAllOrders)
router.get('/user', authenticate, authorize('User'), getOrderByUser)
router.post('/', authenticate, authorize('User'), orderFood); 
router.post('/:food_id', authenticate, authorize('User'), addFood)
router.put('/:order_id', authenticate, authorize('Chef'), confirmRejectOrder); 

module.exports = router;