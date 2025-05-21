const express = require('express');
const { getAllFoods, createFood, deleteFood, updateFood, distinctTypes } = require('../controllers/foodController');
const authorize = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate'); 
const multer = require('multer');
const path = require('path');

const upload = multer({ dest: path.join(__dirname, '../uploads/foods') });
const router = express.Router();

router.get('/', getAllFoods);
router.post('/', authenticate, authorize('Chef'),upload.single('imageUrl'), createFood); 
router.delete('/:food_id', authenticate, authorize('Chef'), deleteFood); 
router.put('/:food_id', authenticate, authorize('Chef'), upload.single('imageUrl'), updateFood);
router.get('/types', distinctTypes);



module.exports = router