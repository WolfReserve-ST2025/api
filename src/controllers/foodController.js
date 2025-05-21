const Food = require('../models/Food')

exports.getAllFoods = async (req, res) => {
    try {
        const foods = await Food.find();
        res.status(200).json(foods);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch foods', error: error.message });
    }
};

exports.createFood = async (req, res) => {
    const role = req.user.role;
    const id = req.user.id;

    if (role !== 'Chef') {
        return res.status(403).json({ message: 'Access denied. Only chefs can create food.' })
    }

    const { name, price, description, type } = req.body;
    const imageUrl = req.file ? `/api/uploads/foods/${req.file.filename}` : null

    console.log(type)
    try {
        const existingFood = await Food.findOne({ name });

        if (existingFood) {
            return res.status(400).json({ message: 'Food with this name already exists.' });
        }

        const newFood = new Food({
            name,
            price,
            description,
            type,
            imageUrl
        })

        await newFood.save()
        res.status(201).json({ message: 'Food created successfully', food: newFood });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create food', error: error.message });
    }
}

exports.deleteFood = async (req, res) => {
    const role = req.user.role;


    if (role !== 'Chef') {
        return res.status(403).json({ message: 'Access denied. Only chefs can delete food.' });
    }

    const { food_id } = req.params;

    try {
        const food = await Food.findByIdAndDelete(food_id);

        if (!food) {
            return res.status(404).json({ message: 'Food not found.' });
        }

        res.status(200).json({ message: 'Food deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete food', error: error.message });
    }
};

exports.updateFood = async (req, res) => {
    const role = req.user.role;

    if (role !== 'Chef') {
        return res.status(403).json({ message: 'Access denied. Only chefs can update food.' });
    }

    const { food_id } = req.params;
    const { name, price, description, imageUrl, type} = req.body;

    try {

        const updatedFood = await Food.findByIdAndUpdate(
            food_id,
            { name, price, description, imageUrl ,type},
            { new: true, runValidators: true }
        );

        if (!updatedFood) {
            return res.status(404).json({ message: 'Food not found.' });
        }

        res.status(200).json({ message: 'Food updated successfully.', food: updatedFood });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update food', error: error.message });
    }
};

exports.distinctTypes = async (req,res) => {
    try {
    const types = await Food.distinct('type');
    console.log(types);
    res.status(200).json(types);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch types' });
  }
}