const User = require('../models/User');

// Get current logged-in user
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all users (Hotel role only)
exports.getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'Hotel') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { name, surname, email } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (name) user.name = name;
        if (surname) user.surname = surname;
        if (email) user.email = email;
        await user.save();
        res.json({
            _id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
            surname: user.surname
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user password
exports.updateUserPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await user.matchPassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }
        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};