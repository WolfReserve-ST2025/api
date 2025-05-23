const Food = require('../models/Food')
const Order = require('../models/Order');
const { createFood } = require('./foodController');

exports.getAllOrders = async (req, res) => {
    const role = req.user.role;

    if (role !== 'Chef') {
        return res.status(403).json({ message: 'Access denied. Only chefs can get all orders.' });
    }
    try {
        const orders = await Order.find()
            .populate('foods')
            .populate('user');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch order', error: error.message });
    }
}

exports.getOrderByUser = async (req, res) => {
    const role = req.user.role;
    const id = req.user.id;

    try {
        const order = await Order.find({ user: id, status: { $in: ['pending', 'confirmed', 'rejected']} }).populate('foods');
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch order', error: error.message });
    }
}

exports.addFood = async (req, res) => {
    const role = req.user.role;
    const id = req.user.id;

    const { food_id } = req.params;
    console.log(food_id)
    if (role !== 'User') {
        return res.status(403).json({ message: 'Access denied. Only users can order food.' })
    }

    try {
        const foodExists = await Food.findById(food_id)

        if (!foodExists) {
            return res.status(400).json({ message: 'Food not found.' })
        }



        let order = await Order.findOne({ user: id, status: 'draft' })

        if (order) {
            const alreadyInOrder = order.foods.some(f => f.toString() === food_id);
            if (alreadyInOrder) {
                return res.status(400).json({ message: 'Food already in order.' });
            }
            order.foods.push(food_id)
            await order.save()
            const populatedOrder = await Order.findById(order._id).populate('foods');
            
            return res.status(200).json({ message: 'Food added to existing order.', order: populatedOrder });
        } else {

            const newOrder = new Order({
                status: 'draft',
                foods: [food_id],
                user: id
            })

            await newOrder.save()
            const populatedOrder = await Order.findById(newOrder._id).populate('foods');
            return res.status(201).json({ message: 'New order created and food added.', order: populatedOrder });
        }


    } catch (error) {
        res.status(500).json({ message: 'Failed to place order.', error: error.message });
    }

}

exports.removeFood = async (req, res) => {
    const role = req.user.role;
    const id = req.user.id;

    const { food_id } = req.params;
    console.log(food_id)
    if (role !== 'User') {
        return res.status(403).json({ message: 'Access denied. Only users can order food.' })
    }

    try {
        const foodExists = await Food.findById(food_id)

        if (!foodExists) {
            return res.status(400).json({ message: 'Food not found.' })
        }

        let order = await Order.findOne({ user: id, status: 'draft' })

        if (order) {
            const objectWithIdIndex = order.foods.findIndex((f) => f.toString() === food_id)
            if (objectWithIdIndex > -1) {
                order.foods.splice(objectWithIdIndex, 1);
                await order.save();
                const populatedOrder = await Order.findById(order._id).populate('foods');
                return res.status(200).json({ message: 'Food removed from order.', order: populatedOrder });
            } else {
                return res.status(404).json({ message: 'Food not found in order.' });
            }
        } else {

            const newOrder = new Order({
                status: 'draft',
                foods: [food_id],
                user: id
            })

            await newOrder.save()
            return res.status(201).json({ message: 'New order created and food added.', order: newOrder });
        }


    } catch (error) {
        res.status(500).json({ message: 'Failed to place order.', error: error.message });
    }

}

exports.orderFood = async (req, res) => {
    const role = req.user.role;
    const id = req.user.id;


    if (role !== 'User') {
        return res.status(403).json({ message: 'Access denied. Only users can order food.' })
    }

    try {

        let order = await Order.findOne({ user: id, status: 'draft' })
        console.log(order)
        if (!order) {
            return res.status(400).json({ message: 'Order does not exist.' })
        }

        order.status = 'pending'

        await order.save()
        res.status(201).json({ message: 'Order placed successfully.', order })

    } catch (error) {
        res.status(500).json({ message: 'Failed to place order.', error: error.message });
    }
}

exports.confirmRejectOrder = async (req, res) => {
    const role = req.user.role;
    const id = req.user.id;

    const { order_id } = req.params;
    const { status } = req.body;

    if (!['confirmed', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Status must be either "confirmed" or "rejected".' });
    }

    if (role !== 'Chef') {
        return res.status(403).json({ message: 'Access denied. Only chefs can confirm/reject food.' });
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            order_id,
            { status },
            { new: true, runValidators: true }
        )

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        res.status(200).json({ message: `Order ${status} successfully.`, order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order.', error: error.message });
    }
};