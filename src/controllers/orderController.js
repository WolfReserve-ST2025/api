const Food = require('../models/Food')
const Order = require('../models/Order')

exports.orderFood = async (req,res) => {
    const role = req.user.role;
    const id = req.user.id;
    
    const {status, foods} = req.body;

    if (role !== 'User') {
        return res.status(403).json({ message: 'Access denied. Only users can order food.' })
    }

    if (!Array.isArray(foods) || foods.length === 0) {
        return res.status(400).json({ message: 'Foods must be a non-empty array.' });
    }

    try{
        const foodExists = await Food.find({_id:{$in: foods}})

        if (foodExists.length !== foods.length){
            return res.status(400).json({message: 'Some foods were not found.'})
        }

        const newOrder = new Order({
            status: status || 'pending',
            foods,
            user: id
        })

        await newOrder.save()
        res.status(201).json({message: 'Order placed successfully.', order: newOrder})
        
    }catch(error){
        res.status(500).json({message:'Failed to place order.', error: error.message});
    }
}

exports.confirmRejectOrder = async (res, req) => {
    const role = req.user.role;
    const id = req.user.id;

    const {order_id} = req.params;
    const {status} = req.body;

    if (!['confirmed', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Status must be either "confirmed" or "rejected".' });
    }

      if (role !== 'Chef') {
        return res.status(403).json({ message: 'Access denied. Only chefs can confirm/reject food.' });
    }

    try{
        const updatedOrder = await Order.findByIdAndUpdate(
            order_id,
            {status},
            {new:true, runValidators: true}
        )

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        res.status(200).json({ message: `Order ${status} successfully.`, order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order.', error: error.message });
    }
};