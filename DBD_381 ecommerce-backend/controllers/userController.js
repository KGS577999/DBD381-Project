// /controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'User already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashed,
            role: role || 'customer' // ✅ assign role if provided
        });

        const token = jwt.sign(
            { id: user._id, role: user.role }, // ✅ include role in token
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({ token });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (e) {
        res.status(500).json({ message: 'Cannot fetch user' });
    }
};
