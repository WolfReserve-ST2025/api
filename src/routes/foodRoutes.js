const express = require('express');
const { getAllFoods, createFood, deleteFood, updateFood } = require('../controllers/foodController');
const authorize = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate'); 

const router = express.Router();

router.get('/', authenticate, authorize('Chef', 'User'), getAllFoods);
router.post('/', authenticate, authorize('Chef'), createFood); 
router.delete('/:food_id', authenticate, authorize('Chef'), deleteFood); 
router.put('/:food_id', authenticate, authorize('Chef'), updateFood); 

module.exports = router;